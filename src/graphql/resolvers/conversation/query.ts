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
  const validate = await validateToken(token);
  console.log("validate token in conversations server > wrapper => ", validate);
  //--------------------------------
  const { id } = await decodeToken(token);
  console.log("decode token in conversations server > wrapper => ", id);
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
    console.log("conversations data server > data wrapper => ", conversations[0].participants, id);
    //-------------------------------------------------------------------
    return conversations.filter((c) => Boolean(c.participants.find((p) => p.userId === id))) || [];
    //-------------------------------------------------------------------
  } catch (err) {
    console.log("Conversations Error", err);
    throw new GraphQLError("Conversations Error");
  }
};
