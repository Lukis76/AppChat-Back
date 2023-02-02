import { GraphQLContext, TypeError } from "../../../../utils/types";
import { decodeToken } from "../../../../utils/decodeToken";

export const refresh = async (
  _: any,
  __: any,
  context: GraphQLContext
): Promise<{ timeOut: boolean } | TypeError> => {
  //=============================================
  const { token } = context;
  //=========================
  try {
    //-----------------------------------------------------------
    // authorized Token
    const { exp } = decodeToken(token);
    const expiredToken = Number(new Date(exp * 1000).getTime());
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
