import { GraphQLContext, User, TypeError, Inputs } from "../../../../utils/types";
import { GraphQLError } from "graphql";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
///////////////////////////////////////////////////////////////////
export const loginUser = async (
  _: any,
  { loginInput }: { loginInput: Inputs },
  context: GraphQLContext
): Promise<User | TypeError> => {
  //========================================
  const { prisma } = context;
  const { email, password } = loginInput;
  //============================================
  try {
    //-------------------------------------------
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });
    //-------------------------------------------------------------------
    const verifyPass = await bcrypt.compare(password, user.passwordHash);
    //-------------------------------------------------------------------
    if (!user || !verifyPass) {
      throw new GraphQLError("Incorrect password or email");
    }
    //-------------------------------------------------------------------
    const userToken = {
      username: user.username,
      email: user.email,
      passHash: user.passwordHash,
    };
    //------------------------------------------------------------
    const token = jwt.sign(userToken, process.env.DECODE_TOKEN, {
      expiresIn: process.env.TIME_TOKEN,
    });
    //------------------------------------------------------------
    if (!token) {
      throw new GraphQLError(
        "An unexpected error occurred while creating the token"
      );
    }
    //------------------------------------------------------------
    const updated = await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        token,
      },
    });
    //-------------------------------------------------------------------
    if (!updated) {
      throw new GraphQLError(
        "An unexpected error occurred while updating the token in the db"
      );
    }
    //-------------------------------------------------------------------
    return {
      id: user.id,
      username: user.username,
      email: user.email,
      token: token,
    };
    //----------------------------------------
  } catch (err) {
    console.log("Login error", err);
    return {
      error: {
        name: err?.name,
        message: err?.message,
      },
    };
  }
};
////////////////////////////////////////////////////////////////////
