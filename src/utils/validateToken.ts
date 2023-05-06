import { GraphQLError } from "graphql";
import { decodeToken } from "./decodeToken";

export const validateToken = async (token: string) => {
  try {
    //-----------------------------------------------------
    if (token === null) {
      throw new Error("The token autentication is null");
    }
    //------------------------------------------------------
    const { exp } = await decodeToken(token);
    console.log('decodeToken => ', exp)
    const timeExpired = Number(new Date(exp * 1000).getTime());
    const timeDate = Number(new Date());
    //-----------------------------------------------------------------
    if (timeExpired > timeDate) {
      throw new GraphQLError("Not authorized, expired time the token");
    }
    //-----------------------------------------------------------------
  } catch (err) {
    return err;
  }
};
