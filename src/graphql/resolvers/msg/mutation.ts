import { GraphQLContext, SendMsgArgs } from "../../../utils/types";
import { GraphQLError } from "graphql";
import { subscriptionEvent } from ".";
import { validateToken } from "../../../utils/validateToken";
import { decodeToken } from "../../../utils/decodeToken";

///////////// Mutation Msg///////////////
export const sendMsg = async (
  _: any,
  args: SendMsgArgs,
  context: GraphQLContext
): Promise<boolean> => {
  ////////////////////////////////////////////
  const { prisma, token, pubsub } = context;
  const { senderId, conversationId, body } = args;
  //------------------------------------------
  // authorized Token
  await validateToken(token);
  //---------------------------------
  const { id } = decodeToken(token);
  //--------------------------------------------------------
  try {
    // Created new msg
    const newMsg = await prisma.msg.create({
      data: {
        id,
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
        userId: id,
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
