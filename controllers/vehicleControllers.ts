import {Request,Response} from "express";
import { validationResult } from "express-validator";
import {
  fetchUserVehicle,
  findAllUserVehicles,
  findVehicleData,
  getVehicleType,
  insertData,
  selectByFieldName,
  selectByFieldNames,
  updateVehicleDetails,
} from "../utils/dbHandler";
import { logger } from "../helpers/logger";
import { ResultSetHeader, Users } from "../types/commonInterface";
import { customerVehicles, vehicleMaster, vehicleOwner, vehicleTypes } from "../types/vehicleInterface";

// add new vehicle for customer
export const addVehicle = async (req:Request, res:Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(301)
        .json({ success: false, message: "Invalid payload" });
    }
    const { type, brand, model, year, numberPlate, description }:{type:string,brand:string,model:string,year:number,numberPlate:string,description:string} = req.body;
    let vehicleImage:string = req.file?.filename || "";

    const users:Users = (req.user) as Users;

    let user:Users[] = await selectByFieldName("users", "email", users.email) as Users[];
    if (user.length < 1) {
      return res
        .status(301)
        .json({ success: false, message: "something went wrong" });
    }

    const isUserVehicle:vehicleOwner[] = await selectByFieldNames("user_has_vehicles", {
      owner_id: user[0].id,
      register_plate_number: numberPlate,
    }) as vehicleOwner[];

    if (isUserVehicle.length > 0) {
      return res
        .status(301)
        .json({ success: false, message: "This Vehicle is already added" });
    }
      
    let vehicleId:number;

    const isVehicle:vehicleMaster[] = await selectByFieldNames("vehicle_master", {
      brand: brand,
      model: model,
      year: year,
    }) as vehicleMaster[];
    if (isVehicle.length < 1) {
      const vehicleResult:number = await insertData(
        "vehicle_master",
        ["type_id", "brand", "model", "year"],
        [type, brand, model, year.toString()]
      ) as number;
      if (vehicleResult === 0) {
        return res
          .status(301)
          .json({ success: false, message: "something went wrong" });
      }
    
      vehicleId = vehicleResult;
    
    }else{
    
      vehicleId = isVehicle[0].id;      
    
    }
    



    const userVehicle:number = await insertData(
      "user_has_vehicles",
      ["owner_id", "vehicle_id", "register_plate_number"],
      [user[0].id.toString(), vehicleId.toString(), numberPlate]
    ) as number;
    if (userVehicle === 0) {
      return res
        .status(301)
        .json({ success: false, message: "something went wrong" });
    }

    const vehicleCondition:number = await insertData(
      "vehicle_condition",
      ["condition_image", "description", "vehicle_id"],
      [vehicleImage, description, userVehicle.toString()]
    ) as number;
    if (vehicleCondition === 0) {
      return res
        .status(301)
        .json({ success: false, message: "something went wrong" });
    }

    return res.status(200).json({
      success: true,
      message: "Vehicle added successfully",
      vehicleId: userVehicle,
    });
  } catch (error) {
    logger.error(error);
    return res
      .status(301)
      .json({ success: false, message: "Something went wrong!" });
  }
};

// get types of vehicles available
export const getVehicleTypes = async (req:Request, res:Response) => {
  try {
    const types:vehicleTypes[] = await getVehicleType() as vehicleTypes[];
    res.status(200).json({ success: true, result: types });
  } catch (error) {
    logger.error(error);
    res.status(503).json({ success: false, message: "Something went wrong!" });
  }
};

// get vehicles of customer by vehicle type
export const getUserVehicle = async (req:Request, res:Response) => {
  try {
    const user:Users = (req.user) as Users;
    const type:string = req.params.type;
    let vehicleData:customerVehicles[] = await findVehicleData(user.email, type) as customerVehicles[];
    return res.json({ success: true, result: vehicleData });
  } catch (error) {
    logger.error(error);
    return res
      .status(301)
      .json({ success: false, message: "Something went wrong!" });
  }
};

// get all vehicles of customer
export const getAllUserVehicles = async (req:Request, res:Response) => {
  try {
    const user:Users = (req.user) as Users;
    const email:string = user.email;
    let vehicles:customerVehicles[] = await findAllUserVehicles(email) as customerVehicles[];
    return res.json({ success: true, result: vehicles });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Something went wrong!" });
  }
};

// get details of customer vehicle
export const getUserVehicleDetails = async (req:Request, res:Response) => {
  try {
    const vehicleId:number = parseInt(req.params.id);
    let vehicleDetails:customerVehicles[] = await fetchUserVehicle(vehicleId) as customerVehicles[];
    return res.json({ success: true, result: vehicleDetails });
  } catch (error) {
    logger.error(error);
    return res
      .status(500)
      .json({ success: false, message: "Something Went Wrong!" });
  }
};

// update customer vehicle
export const updateUserVehicle = async (req:Request, res:Response) => {
  try {
    const { brand, model, year, numberPlate, description, thumbnail, id }:{brand:string,model:string,year:number,numberPlate:string,description:string,thumbnail:string,id:number} =
      req.body;
    let result:number = await updateVehicleDetails([
      numberPlate,
      brand,
      model,
      year.toString(),
      description,
      thumbnail,
      id.toString(),
    ]) as number;
    if (result === 0) {
      res
        .status(400)
        .json({ success: false, message: "Something Went Wrong!" });
    } else {
      res.status(200).json({ success: true, message: "Vehicle Updated" });
    }
  } catch (error) {
    logger.error(error);
    res.status(500).json({ success: false, message: "Something Went Wrong!" });
  }
};
