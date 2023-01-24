import { ConversationFE, GraphQLContext  } from "../../../utils/types";
import { GraphQLError } from "graphql";

///////////// Query //////////////////
export const conversations = async (_: any, __: any, context: GraphQLContext): Promise<Array<ConversationFE>> => {
  //----------------------------------
  const { prisma, session } = context;
  console.log("==>>> por caca ==>>> ", session)
  //------------------------------------------
  if (!session) {
    throw new GraphQLError("Not authorized");
  }
  //-----------------------------------------------------------
  try {
    const conversations = await prisma.conversation.findMany({
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
    //-------------------------------------------------------------------
    return (
      // conversations.filter((c) => !!c.participants.find((p) => p.userId === session?.user?.id)) ||
      []
    );
    //-------------------------------------------------------------------
  } catch (err) {
    console.log("Conversations Error", err);
    throw new GraphQLError("Conversations Error");
  }
};
