import { GraphQLContext, TypeError } from "../../../../utils/types";
import { decodeToken } from "../../../../utils/decodeToken";

export const refresh = async (
  _: any,
  args: {token: string},
  context: GraphQLContext
): Promise<{ timeOut: boolean } | TypeError> => {
  //=============================================
  const { token } = args;
  console.log("🚀 ~ file: refresh.ts:11 ~ token", token)
  //=========================
  try {
    //-----------------------------------------------------------
    // authorized Token
    const { exp } = await decodeToken(token);
    console.log("🚀 ~ file: refresh.ts:16 ~ exp", exp)
    const expiredToken = exp ? Number(new Date(exp * 1000).getTime()) : 0;
    const timeDate = Number(new Date());
    //----------------------------------------------------------
    if (expiredToken < timeDate) {
      console.log('tineOut ==>> ', false)
      return {
        
        timeOut: false,
      };
    } else {
      console.log('tineOut ==>> ', true)

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
