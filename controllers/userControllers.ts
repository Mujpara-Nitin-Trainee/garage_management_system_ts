import {Request,Response} from "express";
import { validationResult } from "express-validator";
import {
  activateUser,
  deleteUserAddress,
  findAddressById,
  findOneById,
  getUserAddress,
  getVehicleAssociatedServices,
  insertAddress,
  insertData,
  insertUserAddress,
  selectByFieldNames,
  updateAddressById,
  updateFields,
  updatePassword,
  updateUserByEmail,
} from "../utils/dbHandler";
import { insert, findOne } from "../utils/common";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { logger } from "../helpers/logger";
import { loginLog, ResultSetHeader, Users } from "../types/commonInterface";
import { addressMaster, userAddress } from "../types/addressInterface";
import { vehicleDetails } from "../types/vehicleInterface";

// register new user
export const register = async (req:Request, res:Response) => {
  try {
    const { role_id, name, email, password }:{role_id:number,name:string,email:string,password:string} = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(301).json({ success: false, message: "Invalid payload" });
    } else {
      const result:Users[] = await findOne(email) as Users[];
      if (result.length) {
        res.status(301).json({
          success: false,
          message: "Email already exists please login to continue",
        });
      } else {
        const salt:string = await bcrypt.genSalt(10);
        const hashedPassword:string = await bcrypt.hash(password, salt);
        let token:string = Math.random().toString(36).slice(2);

        const result:number = await insert(
          "users",
          ["role_id", "name", "email", "password", "activate_link"],
          [role_id.toString(), name, email, hashedPassword, token]
        ) as number;

        if (result !== 0)
          res.status(201).json({
            success: true,
            message: "User registered successfully",
            userId: result,
            token,
          });
        else throw "Something went wrong!";
      }
    }
  } catch (error) {
    logger.error(error);
    res.status(401).json({ success: false, message: "Something went wrong" });
  }
};

// verify user identity with email
export const activate = async (req:Request, res:Response) => {
  try {
    let id:number = parseInt(req.params.id);
    let token:string = req.params.token;
    const data:Users[] = await findOneById(id) as Users[];
    if (token != data[0].activate_link) {
      res.render("login/error", {
        success: false,
        message: "Invalid token or token expired",
      });
    } else {
      
      const result = activateUser(id);

      res.render("auth/success", {
        success: true,
        message: "Your account is activated please login to continue",
      });
    }
  } catch (err) {
    logger.error(err);
    res.status(301).json({ success: false, message: "Something went wrong!" });
  }
};

// verify user credentials and set token if user is valid
export const login = async (req:Request, res:Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid payload" });
    }
    let { email, password }:{email:string,password:string} = req.body;

    let user:Users[] = await findOne(email) as Users[];
    if (!user || user?.length == 0) {
      return res
        .status(301)
        .json({ success: false, message: "Invalid email or password!" });
    } else {
      let userIp:string = req.socket.remoteAddress!;
      let userLog:loginLog[] = await selectByFieldNames("login_logs", {
        user_id: user[0].id,
        attempt_sys_ip: userIp,
      }) as loginLog[];
      if (userLog.length == 0) {
        let insertLog:number = await insertData(
          "login_logs",
          ["user_id", "attempt_count", "attempt_sys_ip"],
          [user[0].id.toString(), "1", userIp]
        ) as number;
        if (insertLog === 0) {
          return res
            .status(500)
            .json({ success: false, message: "Something went wrong!" });
        }
      } else {
        let updateLog:number = await updateFields(
          "login_logs",
          { attempt_count: userLog[0].attempt_count + 1 },
          { user_id: user[0].id, attempt_sys_ip: userIp }
        ) as number;
        if (updateLog === 0) {
          return res
            .status(500)
            .json({ success: false, message: "Something went wrong!" });
        }
      }

      const isPassword:boolean = await bcrypt.compare(password, user[0].password);
      if (!isPassword) {
        return res
          .status(301)
          .json({ success: false, message: "Invalid email or Password" });
      } else if (!user[0].is_verified) {
        return res.status(301).json({
          success: false,
          message:
            "Your account is not activate please click the link to activate your account",
        });
      } else {
        
        const token:string = jwt.sign(
          { email: email },
          process.env.SECRET_KEY || "GarageManagementDB",
          { expiresIn: "1w" } // Change to 1 week   
        );

        res.cookie("token", token, { maxAge: 7 * 24 * 60 * 60 * 1000 }); // Set cookie for 1 week
        return res.status(201).json({
          success: true,
          role_id: user[0].role_id,
          userId: user[0].id,
          message: "Logged in successfully",
        });
      }
    }
  } catch (error) {
    logger.error(error);
    res.status(401).json({ success: false, message: "Something went wrong!" });
  }
};

// send link to reset user password
export const forget = async (req:Request, res:Response) => {
  try {
    const email:string = req.body.email;
    let result:ResultSetHeader[] = await findOne(email) as ResultSetHeader[];
    if (!result[0]) {
      return res.status(301).json({
        success: false,
        message: "Invalid email address",
      });
    }
    return res.status(200).json({
      success: true,
      email,
    });
  } catch (error) {
    logger.error(error);
    res.status(401).json({ success: false, message: "Something went wrong!" });
  }
};

// update user password
export const reset = async (req:Request, res:Response) => {
  try {
    const { email, password }:{email:string,password:string} = req.body;
    let result:Users[] = await findOne(email) as Users[];
    if (!result[0]) {
      return res.status(301).json({
        success: false,
        message: "Invalid email address",
      });
    }
    const salt:string = await bcrypt.genSalt(10);
    const hashedPassword:string = await bcrypt.hash(password, salt);

    let log:number = await insertData(
      "password_change_logs",
      ["user_id", "password"],
      [result[0].id.toString(), result[0].password]
    ) as number;

    let result1:ResultSetHeader[] = await updatePassword(result[0].id, hashedPassword) as ResultSetHeader[];

    if (log === 0) {
      return res
        .status(500)
        .json({ success: false, message: "Something went wrong!" });
    }

    return res.status(200).json({
      success: true,
      message: "password updated successfully",
    });
  } catch (error) {
    logger.error(error);
    res.status(401).json({ success: false, message: "Something went wrong!" });
  }
};

// update user profile
export const updateProfile = async (req:Request, res:Response) => {
  try {
    const user:Users = (req.user) as Users;
    let { name, city, area, pincode, bio }:{name:string,city:string,area:string,pincode:number,bio:string} = req.body;
    let thumbnail:string = req.file?.filename || "";
    let userResult:number = await updateUserByEmail([
      name,
      bio,
      thumbnail,
      user.email,
    ]) as number;
    if (userResult != 1) {
      return res
        .status(301)
        .json({ success: false, message: "Something went wrong!" });
    }

    let userId:number = user.id;
    let address:addressMaster[] = await findAddressById(userId) as addressMaster[];
    if (!address) {
      const result:number = await insertAddress([city, area, pincode.toString()]) as number;
      if (!result) throw "Something went wrong!";
      else {
        await deleteUserAddress(userId) as number;
        const userAddressResult:number = await insertUserAddress([userId, result]) as number;
        if (userAddressResult === 0) throw "Something went wrong!";
        return res
          .status(200)
          .json({ success: true, message: "Your profile updated successfully" });
      }
    }

    let updateAddress:number= await updateAddressById([
      city,
      area,
      pincode.toString(),
      address[0].address_id.toString(),
    ]) as number;

    if (updateAddress != 1) throw "Something went wrong!";

    return res
      .status(200)
      .json({ success: true, message: "Your Profile updated successfully" });
  } catch (error) {
    logger.error(error);
    res.status(401).json({ success: false, message: "Something went wrong!" });
  }
};

// get details of user
export const getUserDetails = async (req:Request, res:Response) => {
  try {
    const user:Users = (req.user) as Users;

    const address:userAddress[] = await getUserAddress(user.id) as userAddress[];
    const vehicleServices:vehicleDetails[] = await getVehicleAssociatedServices(user.id) as vehicleDetails[];
    res
      .status(201)
      .json({ user, address: address[0], vehicleServices: vehicleServices });
  } catch (error) {
    logger.error(error);
    res.status(401).json({ success: false, message: "Something went wrong" });
  }
};

// count number of days from which user is registered
export const daysCount = async (req:Request, res:Response) => {
  try {
    const user:Users = (req.user) as Users;
    const joined = user.created_at;
    const time:number = new Date().getTime() - new Date(joined).getTime();
    const days:number = Math.floor(time / (24 * 60 * 60 * 1000));
    res.status(201).json({ success: true, days });
  } catch (error) {
    logger.error(error);
    res.status(401).json({ success: false, message: "Something went wrong!" });
  }
};
