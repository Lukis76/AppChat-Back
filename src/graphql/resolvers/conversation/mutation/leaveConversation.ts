import { GraphQLContext } from "../../../../utils/types";
import { GraphQLError } from "graphql";
import { subscriptionEvent } from "..";
import { validateToken } from '../../../../utils/validateToken';
import { decodeToken } from '../../../../utils/decodeToken';

export const updateParticipants = async (
  _: any,
  args: { conversationId: string },
  context: GraphQLContext
): Promise<boolean> => {
  //////////////////////////////////////////////////////////////
  const { prisma, token, pubsub } = context;
  const { conversationId } = args;
  //------------------------------------------
  // authorized Token
  await validateToken(token)
  //---------------------------------
  const { id } = await decodeToken(token);
  //--------------------------------------------------------
  try {
    const leaveConversation = await prisma.conversation.update({
      where: {
        id: conversationId,
      },
      data: {
        participants: {
          deleteMany: {
            userId: id,
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
  } catch (err: any) {
    console.log("Leave Conversation Error", err);
    throw new GraphQLError(err?.message);
  }
};
