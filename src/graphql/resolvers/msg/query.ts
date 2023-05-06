import { validateToken } from "../../../utils/validateToken";
import { GraphQLContext, MsgFE } from "../../../utils/types";
import { GraphQLError } from "graphql";
import { decodeToken } from "../../../utils/decodeToken";

///////////// Query Msg //////////////
export const msgs = async (
  _: any,
  args: { conversationId: string, token: string },
  context: GraphQLContext
): Promise<Array<MsgFE>> => {
  /////////////////////////////////////
  const { prisma } = context;
  const { conversationId, token} = args;

  console.log("token => ", token)
  console.log("id cinversation => ", conversationId)
  //------------------------------------------
  // authorized Token
  const tok = await validateToken(token);
  console.log('validate token => ', tok)
  //---------------------------------
  const { id } = await decodeToken(token);
  console.log('decode token => ', id)
  //--------------------------------------------------------
  // Verify participant
  const conversation = await prisma.conversation.findUnique({
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
  });
  /////////////////////////////////////////////////////////
  if (!conversation) {
    throw new GraphQLError("Conversation not authorized");
  }
  ///////////////////////////////////////////////////
  const allowedView = !!conversation.participants.find((p) => p.userId === id);
  ////////////////////////////////////////
  if (!allowedView) {
    throw new Error("Not Authorized");
  }
  ////////////////////////////////////////////
  try {
    const msgs = await prisma.msg.findMany({
      where: {
        conversationId,
      },
      include: {
        sender: {
          select: {
            id: true,
            username: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    /////////////
    return msgs;
    ///////////////////
  } catch (err: any) {
    console.log("Msgs Error", err);
    throw new GraphQLError("Error Msgs");
  }
};
