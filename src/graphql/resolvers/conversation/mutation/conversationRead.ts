import { GraphQLContext } from "@utils/types";
import { GraphQLError } from "graphql";

/////////////// Mutations //////////////
export const conversationRead = async (
  _: any,
  args: { userId: string; conversationId: string },
  context: GraphQLContext
): Promise<boolean> => {
  ///////////////////////////////////////////
  const { userId, conversationId } = args;
  const { prisma, session } = context;
  //-----------------------------------------
  if (!session?.user) {
    throw new GraphQLError("Not authorized");
  }
  //-------------------------------------------------
  try {
    await prisma.conversationParticipant.updateMany({
      where: {
        userId,
        conversationId,
      },
      data: {
        hasSeenLatestMsg: true,
      },
    });
    //----------
    return true;
    //----------
  } catch (err) {
    console.log("ConversationRead error", err);
    throw new GraphQLError(err.message);
  }
};
