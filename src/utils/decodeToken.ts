import jwt from "jsonwebtoken";
import { JwtVerifyTypes } from "./types";

export const decodeToken = async (token: string) => {
  console.log("🚀 ~ file: decodeToken.ts:5 ~ decodeToken ~ token", token)
  //------------------------------------
  try {
    //------------------------------------
    if (token === null) {
      throw new Error("The token autentication is null");
    }
    //------------------------------------
    const parsToken = await JSON.parse(token).toString()
    console.log("🚀 ~ file: decodeToken.ts:14 ~ decodeToken ~ parsToken", parsToken)
    const userToken = jwt.verify(parsToken, process.env.DECODE_TOKEN ) as JwtVerifyTypes
    //----------------------------
    return { ...userToken };
    //------------------------------------
  } catch (err) {
    return err;
  }
};
