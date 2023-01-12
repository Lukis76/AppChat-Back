import { GraphQLContext, MsgFE } from "@utils/types";
import { GraphQLError } from "graphql";

///////////// Query Msg //////////////
export const msgs = async (
  _: any,
  args: { conversationId: string },
  context: GraphQLContext
): Promise<Array<MsgFE>> => {
  /////////////////////////////////////
  const { session, prisma } = context;
  const { conversationId } = args;
  ////////////////////////////////
  if (!session?.user) {
    throw new GraphQLError("Not authorized");
  }
  // ////////////////////////////////////////////////////////////
  // // Verify participant
  // const conversation = await prisma.conversation.findUnique({
  //   where: {
  //     id: conversationId,
  //   },
  //   include: {
  //     participants: true,
  //   },
  // })
  // /////////////////////////////////////////////////////////
  // if (!conversation) {
  //   throw new GraphQLError('Conversation not authorized')
  // }
  // /////////////////////////////////////////////////////
  // const allowedView = conversation.participants.find(
  //   (p) => p.userId === session.user?.id
  // )
  // //////////////////////////////////////////
  // if (!allowedView) {
  //   throw new Error('Not Authorized')
  // }

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
