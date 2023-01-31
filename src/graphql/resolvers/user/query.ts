import { User } from "@prisma/client";
import { GraphQLError } from "graphql";
import { GraphQLContext, TypeError } from "../../../utils/types";
import { validateToken } from "../../../utils/validateToken";
import { decodeToken } from "../../../utils/decodeToken";

//////////// Query /////////////////
export const searchUsers = async (
  _: any,
  args: { username: string },
  context: GraphQLContext
): Promise<Array<User>> => {
  //=========================================
  const { username: searchedUsername } = args;
  const { prisma, token } = context;
  //------------------------------------------
  // authorized Token
  await validateToken(token);
  //---------------------------------
  const { id } = decodeToken(token);
  //--------------------------------------------------------
  const myUser = await prisma.user.findUnique({
    where: {
      id,
    },
  });
  //------------------------------------------
  const users = await prisma.user.findMany({
    where: {
      username: {
        contains: searchedUsername,
        mode: "insensitive",
      },
    },
  });
  //------------------------------------------------------------------
  return users.filter(
    (el) =>
      el.username?.toLocaleLowerCase() !== myUser.username.toLocaleLowerCase()
  );
  //------------------------------------------------------------------
};

// export const user = async (_, args, context: GraphQLContext) =>
//   await context.prisma.user.findUnique({
//     where: {
//       id: args.id,
//     },
//   });

export const refresh = async (
  _: any,
  args: { id: string },
  context: GraphQLContext
): Promise<{ timeOut: boolean } | TypeError> => {
  const { prisma, token } = context;
  //---------------------------------
  // authorized Token
  await validateToken(token);
  //--------------------------------------------
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: args.id,
      },
    });
    //-------------------------------------------
    if (!user) {
      throw new GraphQLError("user not exist");
    }
    //-------------------------------------------
    return {
      timeOut: true,
    };
    //--------------
  } catch (err) {
    return {
      error: {
        name: err.name,
        message: err.message,
      },
    };
  }
};
