import { ConversationFE, GraphQLContext } from "../../../utils/types";
import { GraphQLError } from "graphql";
import { validateToken } from "../../../utils/validateToken";
import { decodeToken } from "../../../utils/decodeToken";

///////////// Query //////////////////
export const conversations = async (
  _: any,
  __: any,
  context: GraphQLContext
): Promise<Array<ConversationFE>> => {
  //----------------------------------
  const { prisma, token } = context;
  //------------------------------------------
  // authorized Token
  await validateToken(token);
  //--------------------------------
  const { id } = decodeToken(token);
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
      conversations.filter(
        (c) => !!c.participants.find((p) => p.userId === id)
      ) || []
    );
    //-------------------------------------------------------------------
  } catch (err) {
    console.log("Conversations Error", err);
    throw new GraphQLError("Conversations Error");
  }
};
