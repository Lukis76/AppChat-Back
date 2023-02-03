import { validateToken } from "../../../utils/validateToken";
import { GraphQLContext, MsgFE } from "../../../utils/types";
import { GraphQLError } from "graphql";
import { decodeToken } from "../../../utils/decodeToken";

///////////// Query Msg //////////////
export const msgs = async (
  _: any,
  args: { conversationId: string },
  context: GraphQLContext
): Promise<Array<MsgFE>> => {
  /////////////////////////////////////
  const { token, prisma } = context;
  const { conversationId } = args;
  //------------------------------------------
  // authorized Token
  await validateToken(token);
  //---------------------------------
  const { id } = await decodeToken(token);
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
