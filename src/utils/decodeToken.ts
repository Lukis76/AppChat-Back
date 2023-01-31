import jwt from "jsonwebtoken";
import { JwtVerifyTypes } from "./types";

export const decodeToken = (token: string) => {
  //------------------------------------
  const userToken = jwt.verify(
    token,
    process.env.DECODE_TOKEN
  ) as JwtVerifyTypes;
  //----------------------------
  return {...userToken}

};
