import { GraphQLContext, SendMsgArgs } from "@utils/types";
import { GraphQLError } from "graphql";
import { subscriptionEvent } from ".";

///////////// Mutation Msg///////////////
export const sendMsg = async (
  _: any,
  args: SendMsgArgs,
  context: GraphQLContext
): Promise<boolean> => {
  ////////////////////////////////////////////
  const { prisma, session, pubsub } = context;
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
    console.log("🚀 ~ file: mutation.ts:38 ~ newMsg", newMsg);

    /////////////////////////////////////////////////////////////////////
    const participant = await prisma.conversationParticipant.findFirst({
      where: {
        userId: session.user.id,
        conversationId,
      },
    });
    console.log("🚀 ~ file: mutation.ts:48 ~ participant", participant);
    ///////////////////////////////////////////////////////
    if (!participant) {
      throw new GraphQLError("Participant does not exist");
    }
    //////////////////////////////////////////////////////
    // Update Coversation
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
          updateMany: {
            where: {
              NOT: {
                userId: session?.user?.id,
              },
            },
            data: {
              hasSeenLatestMsg: false,
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
    console.log("🚀 ~ file: mutation.ts:106 ~ conversation", conversation);
    /////////////////////////////////////////////////////
    pubsub.publish(subscriptionEvent.msgSend, {
      msgSend: newMsg,
    });
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
