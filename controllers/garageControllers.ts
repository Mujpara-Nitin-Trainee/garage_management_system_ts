import {Request,Response} from "express";
import { validationResult } from "express-validator";
import {
  insertGarage,
  insertGarageAddress,
  insertGarageOwner,
  insertGarageReference,
  updateGarage,
  updateGarageAddress,
  displayGarage,
  getOwnerGarages,
  garageSlotListing,
  getNearByGarage,
  getSingleGarageService,
  getGarageAppointments,
  getGarageDuration,
  updateFields,
  garagesCount,
  countgarages,
  getGarageAddress,
} from "../utils/dbHandler";

import { dateTimeConvertor } from "../helpers/dateTimeConvertor";
import { logger } from "../helpers/logger";
import { Users } from "../types/commonInterface";
import { garages,garageDuration, garageAddressInterface } from "../types/garageInterface";
import { paging } from "../types/appointmentsInterface";
import { customerInvoiceDetails } from "../types/invoiceInterface";

// display garage form with data
export const garageDisplay = async (req:Request, res:Response) => {
  try {
    let garageId:number = 1;
    let data = await displayGarage(garageId);
    res.render("garage/garageModule", { title: "Garage Form", data });
  } catch (error) {
    logger.error(error);
    res.status(401).json({ success: false, message: "Something went wrong!" });
  }
};

// add new garage
export const garageAdd = async (req:Request, res:Response) => {
  try {
    let {
      garageName,
      contactNumber,
      email,
      openTime,
      closeTime,
      cityId,
      description,
      area,
      pincode,
      userId,
      latitude,
      longitude,
    }:{ garageName:string,contactNumber:number,email:string,openTime:string,closeTime:string,cityId:number,description:string,area:string,pincode:number,userId:number,latitude:string,longitude:string} = req.body;
    let thumbnail:string = req.file?.filename || "";

    const user:Users = (req.user as Users);

    userId = user.id || userId;
    
    openTime = dateTimeConvertor(openTime);
    closeTime = dateTimeConvertor(closeTime);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res
        .status(500)
        .json({ success: false, message: "Something went wrong!" });
    } else {
      
      let addressId:number = await insertGarageAddress([cityId.toString(), area, pincode.toString()]) as number;

      if (addressId) {
        let garageId:number= await insertGarage([garageName,contactNumber.toString(),email,thumbnail,openTime,closeTime,description]) as number;

        if (garageId) {
        
          let result:number= await insertGarageOwner([userId, garageId])  as number;
        
          let result2:number = await insertGarageReference([
            addressId.toString(),
            garageId.toString(),
            latitude,
            longitude,
          ]) as number;

          if (result && result2) {
            res.status(200).json({
              success: true,
              message: "garage registered successfully.",
            });
          }
        } else throw "Something went wrong!";
      } else throw "Something went wrong!";
    }
  } catch (error) {
    logger.error(error);
    res.status(401).json({ success: false, message: "Something went wrong!" });
  }
};

// update garage if exists
export const garageUpdate = async (req:Request, res:Response) => {
  try {
    let {
      garageName,
      contactNumber,
      email,
      openTime,
      closeTime,
      cityId,
      description,
      area,
      pincode,
      garageId,
    }:{ garageName:string, contactNumber:number, email:string, openTime:string, closeTime:string, cityId:number, description:string,area:string,pincode:number,garageId:number} = req.body;

    let thumbnail:string = (req.file as {filename:string}).filename;
    
    openTime = dateTimeConvertor(openTime);
    closeTime = dateTimeConvertor(closeTime);
    
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(500).json({ success: false, message: "Invalid payload" });
    } else {
      
      let result:number = await updateGarage([
        garageName,
        contactNumber.toString(),
        email,
        thumbnail,
        openTime,
        closeTime,
        description,
        garageId.toString(),
      ])  as number;

      if (result) {

        let result:number = await updateGarageAddress([
          cityId.toString(),
          area,
          pincode.toString(),
          garageId.toString(),
        ]) as number;

        if (result) {
          res.status(200).json({ success: true, message: "garage updated" });
        } else throw "Something went wrong";
      } else throw "Something went wrong";
    }
  } catch (error) {
    logger.error(error);
    res.status(401).json({ success: false, message: "Something went wrong!" });
  }
};

// delete garage if exists
export const garageDelete = async (req:Request, res:Response) => {
  try {
    const garageId:number = parseInt(req.params.garageId);
    let garageResult:number = await updateFields(
      "garage_master",
      { is_deleted: 1 },
      { id: garageId }
    ) as number;

    let garageAddressResult:number = await updateFields(
      "garage_address",
      { is_deleted: 1 },
      { garage_id: garageId }
    ) as number;

    let garageServiceResult:number = await updateFields(
      "garage_has_services",
      { is_deleted: 1 },
      { garage_id: garageId }
    ) as number;

    if (
      garageResult === 0 ||
      garageAddressResult === 0 ||
      garageServiceResult === 0
    ) {
      return res
        .status(500)
        .json({ success: false, message: "Something went wrong" });
    }

    return res.status(200).json({ success: true, message: "garage deleted" });
  } catch (error) {
    logger.error(error);
    res.status(401).json({ success: false, message: "Something went wrong" });
  }
};

// get all garages of an owner
export const getGarageListing = async (req:Request, res:Response) => {
  try {
    const user:Users = (req.user as Users);
    const result:garages[] = await getOwnerGarages(user.id) as garages[];
    res.json({ garages: result });
  } catch (error) {
    logger.error(error);
    res.status(500).json({ error: error});
  }
};

// get all slots of a garage
export const getGarageSlots = async (req:Request, res:Response) => {
  try {
    let garageId:number = req.body.garageId;
    let garageDuration:garageDuration[] = await getGarageDuration(garageId) as garageDuration[];
    const result:garageDuration[] = await garageSlotListing(garageId,garageDuration[0].open_time, garageDuration[0].close_time ) as garageDuration[];
    result.push(garageDuration[0]);
    res.json(result);
  } catch (error) {
    logger.error(error);
    res.status(500).json({ success: false, message: "Something went wrong!" });
  }
};

// get garages details of an owner
export const getGarages = async (req:Request, res:Response) => {
  try {
    let distance:number = parseInt(req.params.dist) || 10;
    let lat:string = req.params.lat;
    let long:string = req.params.long;
    const result:garages[] = await getNearByGarage(distance, lat, long) as garages[];
    res.json({ result });
  } catch (error) {
    logger.error(error);
    res.status(500).json({ error: error });
  }
};

// get details of a specific garage with id
export const getSingleGarage = async (req:Request, res:Response) => {
  try {
    let garageId:number = parseInt(req.params.id);
    const result = await getSingleGarageService(garageId);
    res.json({ result });
  } catch (error) {
    logger.error(error);
    res.status(500).json({ error: error });
  }
};

// get number of garages owned by a user
export const getGarageCount = async (req:Request, res:Response) => {
  try {
    const user:Users = (req.user as Users);
    const garageCount:number = await countgarages(user.id) as number;
    res.status(201).json({ success: true, garageCount });
  } catch (error) {
    logger.error(error);
    res.status(401).json({ success: false, message: "Something went wrong!" });
  }
};

// get all appointments of a garage
export const showGarageAppointments = async (req:Request, res:Response) => {
  try {
    const { startIndex, endIndex, limit }:paging = req.pagination as paging;
    const garageId :number = parseInt(req.params.garageId);

    let appointments:customerInvoiceDetails[][] = await getGarageAppointments(garageId, startIndex) as customerInvoiceDetails[][];

    return res.status(200).json({
      success: true,
      appointments: appointments[0],
      pagination: {
        totalRecords: appointments[1][0].count,
        startIndex,
        endIndex,
        totalPages: Math.ceil(appointments[1][0].count / limit),
      },
    });
  } catch (error) {
    logger.error(error);
    return res
      .status(500)
      .json({ success: false, message: "Something went wrong!" });
  }
};

// get address of garage
export const garageAddress = async (req:Request, res:Response) => {
  try {
    let garageId:number = parseInt(req.params.garageId)
    const result:garageAddressInterface[] = await getGarageAddress(garageId) as garageAddressInterface[];
    res.status(201).json({ address: result });
  } catch (error) {
    logger.error(error);
    res.status(500).json({ success: false, message: "Something went wrong!" });
  }
};
