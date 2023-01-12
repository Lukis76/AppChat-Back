import { GraphQLContext } from "@utils/types";
import { GraphQLError } from "graphql";

///////////// Query //////////////////
export const conversations = async (
  _: any,
  __: any,
  context: GraphQLContext
) => {
  //----------------------------------
  const { prisma, session } = context;
  //------------------------------------------
  if (!session?.user) {
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
        latestMsg: true,
      },
    });
    //-------------------------------------------------------------------
    return conversations.filter(
      (c) => !!c.participants.find((p) => p.userId === session?.user?.id)
    );
    //-------------------------------------------------------------------
  } catch (err) {
    console.log("Conversations Error", err);
    throw new GraphQLError("Conversations Error");
  }
};
