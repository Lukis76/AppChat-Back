import { GraphQLContext, SendMsgArgs } from "../../../utils/types";
import { GraphQLError } from "graphql";
import { subscriptionEvent } from ".";

///////////// Mutation Msg///////////////
export const sendMsg = async (_: any, args: SendMsgArgs, context: GraphQLContext): Promise<boolean> => {
  ////////////////////////////////////////////
  const { prisma, session, pubsub } = context;
  const userId = session?.user?.id as string;
  const { id: msgId, senderId, conversationId, body } = args;
  ///////////////////////////////////////////////////////////
  // authorized
  if (!session?.user || session.user.id !== senderId) {
    throw new GraphQLError("Not authorized");
  }
  ///////////////////////////////////////////
  try {
    // Created new msg
    const newMsg = await prisma.msg.create({
      data: {
        id: msgId,
        senderId,
        conversationId,
        body,
      },
      include: {
        sender: {
          select: {
            id: true,
            username: true,
          },
        },
      },
    });

    /////////////////////////////////////////////////////////////////////
    const participant = await prisma.conversationParticipant.findFirst({
      where: {
        userId,
        conversationId,
      },
    });
    ///////////////////////////////////////////////////////
    if (!participant) {
      throw new GraphQLError("Participant does not exist");
    }
    //////////////////////////////////////////////////////
    // Update Coversation

    await prisma.conversationParticipant.updateMany({
      where: {
        conversationId: conversationId,
      },
      data: {
        hasSeenLatestMsg: false,
      },
    });

    const conversation = await prisma.conversation.update({
      where: {
        id: conversationId,
      },
      data: {
        latestMsgId: newMsg?.id,
        participants: {
          update: {
            where: {
              id: participant?.id,
            },
            data: {
              hasSeenLatestMsg: true,
            },
          },
        },
      },
      include: {
        participants: {
          include: {
            user: {
              select: {
                id: true,
                username: true,
              },
            },
          },
        },
        latestMsg: {
          include: {
            sender: {
              select: {
                id: true,
                username: true,
              },
            },
          },
        },
      },
    });

    /////////////////////////////////////////////////////
    pubsub.publish(subscriptionEvent.msgSend, {
      msgSend: newMsg,
    });
    //------------------------------------------------------
    pubsub.publish(subscriptionEvent.conversationUpdated, {
      conversationUpdated: {
        conversation,
      },
    });
    ////////////////////////////////////
    return true;
    /////////////////////////////////////
  } catch (err) {
    console.log("Send Msg Error", err);
    throw new GraphQLError("Error send msg");
  }
};
