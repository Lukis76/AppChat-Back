import { User } from "@prisma/client";
import { GraphQLContext } from "../../../../utils/types";
import { validateToken } from "../../../../utils/validateToken";
import { decodeToken } from "../../../../utils/decodeToken";

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
  const { id: myId } = await decodeToken(token);
  //------------------------------------------
  const users = await prisma.user.findMany({
    where: {
      username: {
        contains: searchedUsername,
        mode: "insensitive",
      },
    },
  });
  //-------------------------------------------
  return users.filter((el) => el.id !== myId);
  //-------------------------------------------
};
