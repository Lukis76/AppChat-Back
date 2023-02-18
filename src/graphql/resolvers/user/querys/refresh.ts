import { GraphQLContext, TypeError } from "../../../../utils/types";
import { decodeToken } from "../../../../utils/decodeToken";

export const refresh = async (
  _: any,
  args: {token: string},
  context: GraphQLContext
): Promise<{ timeOut: boolean } | TypeError> => {
  //=============================================
  const { token } = args;
  //=========================
  try {
    //-----------------------------------------------------------
    // authorized Token
    const { exp } = await decodeToken(token);
    const expiredToken = exp ? Number(new Date(exp * 1000).getTime()) : 0;
    const timeDate = Number(new Date());
    //----------------------------------------------------------
    if (expiredToken < timeDate) {
      return {
        
        timeOut: false,
      };
    } else {

      return {
        timeOut: true,
      };
    }
    //-----------------
  } catch (err) {
    return {
      error: {
        name: err.name,
        message: err.message,
      },
    };
  }
};
