import jwt from "jsonwebtoken";
import { JwtVerifyTypes } from "./types";

export const decodeToken = async (token: string) => {
  //------------------------------------
  try {
    //------------------------------------
    if (token === null) {
      throw new Error("The token autentication is null");
    }
    //------------------------------------
    const parsToken = await JSON.parse(token).toString()
    console.log('parsToken => ', parsToken)
    const userToken = jwt.verify(parsToken, process.env.DECODE_TOKEN ) as JwtVerifyTypes
    console.log('userToken ==================================================> ', userToken)
    //----------------------------
    return { ...userToken };
    //------------------------------------
  } catch (err) {
    console.log('error chaval => ', err)
    return err;
  }
};
