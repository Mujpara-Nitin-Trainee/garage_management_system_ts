import {Request,Response} from "express"
import { validationResult } from "express-validator";
import {
  countServices,
  deleteGarageService,
  getNotAvailableService,
  getOwnerService,
  getServices,
  insertGarageService,
  insertService,
  serviceListing
} from "../utils/dbHandler";
import { logger } from "../helpers/logger";
import { Users } from "../types/commonInterface";
import { services } from "../types/serviceInterface";

// add new service to a garage
export const addService = async (req:Request, res:Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(301)
        .json({ success: false, message: "Invalid payload" });
    }
    let { garageId, price }:{garageId:number,price:number} = req.body;
    let serviceId:number = req.body.serviceId;

    if (serviceId == undefined) {
      let { serviceName, description }:{serviceName:string,description:string} = req.body;
      const resultId:number = await insertService([serviceName, description]) as number;
      if (!resultId) {
        return res
          .status(301)
          .json({ success: false, message: "something went wrong" });
      } else serviceId = resultId;
    }
    let garageResult:number = await insertGarageService([garageId, serviceId, price]) as number;
    if (!garageResult) {
      return res
        .status(301)
        .json({ success: false, message: "Something went wrong!" });
    }
    return res
      .status(200)
      .json({ success: true, message: "Service added successfully" });
  } catch (error) {
    logger.error(error);
    return res.status(301).json({ success: false, message: error });
  }
};

// delete service from garage with id
export const deleteService = async (req:Request, res:Response) => {
  try {
    let id:number = parseInt(req.params.id) || 0;
    let garageResult:number = await deleteGarageService(id) as number;
    if (!garageResult) {
      return res
        .status(301)
        .json({ success: false, message: "Something went wrong!" });
    }
    return res
      .status(200)
      .json({ success: true, message: "Service deleted successfully" });
  } catch (error) {
    logger.error(error);
    return res.status(301).json({ success: false, message: error});
  }
};

// get all services of a specific garage
export const servicesListing = async (req:Request, res:Response) => {
  
  let garageId:number = parseInt(req.params.garageId);
  
  try {
    const servicesList:services[] = await serviceListing(garageId) as services[];
    res.json({ success: true, result: servicesList });
  } catch (error) {
    logger.error(error);
    res.status(500).json({ success: false, message: error });
  }
};

// get all the services available on the platform
export const allServices = async (req:Request, res:Response) => {
  try {
    const services:services[] = await getServices() as services[];
    res.status(201).json({ success: true, services });
  } catch (error) {
    logger.error(error);
    res.status(401).json({ success: false, message: "Something went wrong!" });
  }
};

// count number of services provided by owner garages
export const getServiceCount = async (req:Request, res:Response) => {
  try {
    
    const user:Users = (req.user as Users);

    const serviceCount:number = await countServices(user.id) as number;
    res.status(201).json({ success: true, serviceCount });
  } catch (error) {
    logger.error(error);
    res.status(401).json({ success: false, message: "Something went wrong" });
  }
};

// find services for owner with garage id
export const findOwnerService = async (req:Request, res:Response) => {
  try {

    const user:Users = (req.user as Users);

    const garageId:number = req.body.garageId;
    const services:services[] = await getOwnerService(user.id, garageId) as services[];
    res.status(201).json({ success: true, services });
  } catch (error) {
    logger.error(error);
    res.status(401).json({ success: false, message: "Something went wrong!" });
  }
};

// get services not available in a garage
export const getGarageNotService = async (req:Request, res:Response) => {
  try {
    let id:number = parseInt(req.params.id);
    const services:services[] = await getNotAvailableService(id) as services[];
    res.status(201).json({ services });
  } catch (error) {
    logger.error(error);
    res.status(500).json({ success: false, message: "Something went wrong!" });
  }
};