import { Request,Response,NextFunction } from "express";
import { Users } from "../types/commonInterface";

export const validateRole = (role_id:number) => (req:Request, res:Response, next:NextFunction) => {

  const user:Users = (req.user) as Users;

  if (!req.user) {
    return res.redirect("/u/signIn");
  }
  if (user.role_id == role_id) {
    next();
  } else {
    res.redirect("/u/signIn");
  }
}
