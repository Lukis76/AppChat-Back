import { CreateUsernameResponse, GraphQLContext } from "@utils/types";

/////////////// Mutation ///////////////
export const createUsername = async (
  _: any,
  args: { username: string },
  context: GraphQLContext
): Promise<CreateUsernameResponse> => {
  const { session, prisma } = context;

  if (!session?.user) {
    return {
      error: "Not authorized",
    };
  }
  // @ts-ignore
  const { id } = session?.user;
  const { username } = args;

  try {
    const existingUser = await prisma.user.findUnique({
      where: {
        username,
      },
    });

    if (existingUser) {
      return {
        error: "Username already taken. Try another",
      };
    }
    await prisma.user.update({
      where: {
        id,
      },
      data: {
        username,
      },
    });

    return { success: true };
  } catch (err) {
    console.log("CreateUsername error", err);
    return {
      error: err?.message,
    };
  }
};
