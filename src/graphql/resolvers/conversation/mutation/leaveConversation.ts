import { GraphQLContext } from "@utils/types";
import { GraphQLError } from "graphql";
import { subscriptionEvent } from "../";

export const updateParticipants = async (_: any, args: { conversationId: string }, context: GraphQLContext): Promise<boolean> => {
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  const { prisma, session, pubsub } = context;
  const { conversationId } = args;
  //------------------------------------------
  // authorized
  if (!session?.user) {
    throw new GraphQLError("Not authorized");
  }
  //-------------------------------------------------------------
  try {
    const leaveConversation = await prisma.conversation.update({
      where: {
        id: conversationId,
      },
      data: {
        participants: {
          deleteMany: {
            userId: session.user.id,
            conversationId,
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
      },
    });
    //------------------------------------------------------
    pubsub.publish(subscriptionEvent.conversationUpdated, {
      conversationUpdated: leaveConversation,
    });
    //-----------
    return true;
    //-----------
  } catch (err) {
    console.log("Leave Conversation Error", err);
    throw new GraphQLError(err?.message);
  }
};
