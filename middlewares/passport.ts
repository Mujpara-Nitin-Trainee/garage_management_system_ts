import { ExtractJwt, JwtFromRequestFunction, Strategy,StrategyOptions,StrategyOptionsWithoutRequest } from "passport-jwt";
import { config } from "dotenv";
import { findOne } from "../utils/common";
import passport from "passport";
import {Request} from "express";
import { JwtPayload } from "jsonwebtoken";
import { Users } from "../types/commonInterface";

config();
var cookieExtractor = function (req:Request) {
  var token:string = "";
  if (req && req.cookies) {
    token = req.cookies.token;
  }
  return token;
};

export const applyPassportStrategy = () => {
  
  let jwt;
  
  try {
    jwt = ExtractJwt.fromExtractors([cookieExtractor]) as JwtFromRequestFunction;
  }
  catch (error) {
    return null;
  }
  
  const options:StrategyOptions= {secretOrKey:process.env.SECRET_KEY,jwtFromRequest:jwt} as StrategyOptionsWithoutRequest;
  
  passport.use(
    new Strategy(options, async (payload:JwtPayload, done) => {
      let result:Users[] = await findOne(payload.email) as Users[];
      let data:Users = result[0];
      if (result) {
        return done(null, data);
      }
      return done(null, false);
    })
  );
};
