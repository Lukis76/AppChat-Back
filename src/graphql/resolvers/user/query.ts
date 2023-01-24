// import { User } from "@prisma/client";
// import { GraphQLError } from "graphql";
import { GraphQLContext } from "../../../utils/types";

//////////////// Query /////////////////
// export const searchUsers = async (
//   _: any,
//   args: { username: string },
//   context: GraphQLContext
// ): Promise<Array<User>> => {
//   //=========================================
//   const { username: searchedUsername } = args;
//   const { prisma, session } = context;
//   console.log("holis one =>  🎱 ", searchedUsername, " 👍 prev => ", session);
//   //========================================
//   // if (!session?.user) {
//   //   throw new GraphQLError("Not authorized");
//   // }
//   //=============================================
//   console.log("holis two =>  🎱 ", searchedUsername, " 👍 post => ", session);
//   const {
//     user: { username: myUserName },
//   } = session;
//   //=======================================
//   console.log("holis =>  🦓 ", typeof myUserName);

//   const users = await prisma.user.findMany({
//     where: {
//       username: {
//         contains: searchedUsername,
//         mode: "insensitive",
//       },
//     },
//   });
//   console.log("por ca => 💯");
//   const arrUsers = users.filter(
//     (el) => el.username?.toLocaleLowerCase() !== myUserName.toLocaleLowerCase()
//   );
//   console.log("🚀 ~ file: user.ts:30 ~ users ", arrUsers);

//   return arrUsers;
// };
//

export const user = async (_, args, context: GraphQLContext) =>
  await context.prisma.user.findUnique({
    where: {
      id: args.id,
    },
  })
