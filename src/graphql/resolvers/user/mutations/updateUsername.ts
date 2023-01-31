import { GraphQLContext, User, TypeError } from "../../../../utils/types";
import { GraphQLError } from "graphql";
// import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
///////////////////////////////////////////////////////////////////////
export const updateUsername = async (
  _: any,
  args: { newUsername: string; email: string; password: string },
  context: GraphQLContext
): Promise<User | TypeError> => {
  //=============================================================
  const { prisma } = context;
  const { newUsername, email, password } = args;
  //=============================================================
  try {
    //---------------------------------------------
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });
    //-------------------------------------------------------------------
    const verifyPass = await bcrypt.compare(password, user.passwordHash);
    //-------------------------------------------------------------------
    if (!verifyPass) {
      throw new GraphQLError("Incorrect password");
    }
    //---------------------------------------------
    const upadted = await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        username: newUsername,
      },
    });
    //----------------------------------------------------------------------
    if (!upadted) {
      throw new GraphQLError(
        "An unexpected error occurred while updating the username in the db"
      );
    }
    //---------------------------------------------------------------------
    return {
      id: user.id,
      email: user.email,
      username: newUsername,
    };
    //----------------------------------------
  } catch (err) {
    console.log("Updated Username error", err);
    return {
      error: {
        name: err.name,
        message: err.message,
      },
    };
  }
};
////////////////////////////////////////////////////////////////////
