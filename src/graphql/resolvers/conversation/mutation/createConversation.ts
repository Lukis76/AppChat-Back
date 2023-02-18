import { GraphQLContext } from "../../../../utils/types";
import { GraphQLError } from "graphql";
import { subscriptionEvent } from "..";
import { validateToken } from "../../../../utils/validateToken";

export const createConversation = async (
  _: any,
  args: { participantIds: Array<string> },
  context: GraphQLContext
): Promise<{ conversationId: string }> => {
  ////////////////////////////////////////////
  const { prisma, token, pubsub } = context;
  const { participantIds } = args;
  //------------------------------------------
  // authorized Token
  await validateToken(token);
  //--------------------------------------------------------
  try {
    // Created new convesation
    const conversation = await prisma.conversation.create({
      data: {
        participants: {
          createMany: {
            data: participantIds.map((id) => ({
              userId: id,
              hasSeenLatestMsg: false, // id === session.user?.id,
            })),
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
    //////////////////////////////////////////
    // emit a conversation event using pubsub
    pubsub.publish(subscriptionEvent.conversationCreated, {
      conversationCreated: conversation,
    });
    //----------------------------------------
    return { conversationId: conversation.id };
    //----------------------------------------
  } catch (err) {
    console.log("CreateConversationError", err);
    throw new GraphQLError("Error created conversation");
  }
};
