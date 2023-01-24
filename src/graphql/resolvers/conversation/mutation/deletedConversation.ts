import { GraphQLContext} from "../../../../utils/types";

import { GraphQLError } from "graphql";
import { subscriptionEvent } from "../";

export const deleteConversation = async (_: any, args: { conversationId: string }, context: GraphQLContext): Promise<boolean> => {
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  const { prisma, session, pubsub } = context;
  const { conversationId } = args;
  ////////////////////////////////
  // authorized
  if (!session) {
    throw new GraphQLError("Not authorized");
  }
  ///////////////////////////////////////////
  try {
    //=========================================================
    // Deleted conversation
    const [deletedConversation] = await prisma.$transaction([
      //-----------------------------------------------------
      prisma.conversation.delete({
        where: {
          id: conversationId,
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
      }),
      //------------------------------------------
      prisma.conversationParticipant.deleteMany({
        where: {
          conversationId,
        },
      }),
      //------------------------
      prisma.msg.deleteMany({
        where: {
          conversationId,
        },
      }),
      //--------------------
    ]);
    //======================================================
    pubsub.publish(subscriptionEvent.conversationDeleted, {
      conversationDeleted: deletedConversation,
    });
    //======================================================
    return true;
    //==========
  } catch (err) {
    console.log("CreateConversationError", err);
    throw new GraphQLError("Error created conversation");
  }
};
