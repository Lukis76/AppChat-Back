import { GraphQLContext} from "../../../../utils/types";
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
  if (!session) {
    throw new GraphQLError("Not authorized");
  }
  //-------------------------------------------------
  try {
    const participant = await prisma.conversationParticipant.findFirst({
      where: { userId, conversationId },
    });
    //------------------------------------------------
    if (!participant) {
      throw new GraphQLError("Participant not found");
    }
    //------------------------------------------------
    await prisma.conversationParticipant.update({
      where: { id: participant.id },
      data: {
        hasSeenLatestMsg: true,
      },
    });
    //----------
    return true;
    //----------
  } catch (err: any) {
    console.log("ConversationRead error", err);
    throw new GraphQLError(err.message);
  }
};
