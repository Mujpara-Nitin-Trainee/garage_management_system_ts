import {Request,Response} from "express";
import { validationResult } from "express-validator";
import {
  deleteSlot,
  getAllSlots,
  getAppointsByDateRange,
  insertSlot,
  updateSlot,
  bookSlotService,
} from "../utils/dbHandler";
import { logger } from "../helpers/logger";
import { ResultSetHeader, Users } from "../types/commonInterface";
import { slots } from "../types/slotInterface";
import { paging } from "../types/appointmentsInterface";

// slot booking by customer
export const slotBooking = async (req:Request, res:Response) => {
  try {
    
    const { garageId, startTime, endTime }:{garageId:number,startTime:string,endTime:string} = req.body;

    const errors = validationResult(req);
    
    if (!errors.isEmpty()) {
      res.status(301).json({ success: false, errors: errors.array() });
    } else {
      const result:number = await insertSlot([garageId.toString(), startTime, endTime, "1"]) as number;
      if (!result)
        res
          .status(301)
          .json({ success: false, message: "something went wrong" });
      else if (result === 0) {
        res.status(301).json({
          success: false,
          message: "error adding slot please try again",
        });
      } else {
        res
          .status(201)
          .json({ success: true, message: "slot inserted successfully" });
      }
    }
  } catch (error) {
    logger.error(error);
    res.status(401).json({ success: false, message: "Something went wrong" });
  }
};

// update slot timings -- not needed
export const slotUpdate = async (req:Request, res:Response) => {
  try {
    const { startTime, endTime, slotId }:{startTime:string,endTime:string,slotId:number} = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(301).json({ success: false, errors: errors.array() });
    } else {
      const result:number = await updateSlot([startTime, endTime, slotId.toString()]) as number;
      if (result === 0) {
        res.status(201).json({ message: "slot updated successfully" });
      } else {
        res.status(301).json({ message: "slot was not updated" });
      }
    }
  } catch (error) {
    logger.error(error);
    res.status(401).json({ success: false, message: "Something went wrong" });
  }
};

// delete a slot with id
export const slotDelete = async (req:Request, res:Response) => {
  try {
    const slotId:number = parseInt(req.params.slotId);
    const result:number = await deleteSlot(slotId) as number;
    if (result === 1) {
      res
        .status(201)
        .json({ success: true, message: "slot was deleted successfully" });
    } else {
      res.status(301).json({ success: false, message: "slot was not deleted" });
    }
  } catch (error) {
    logger.error(error);
    res.status(401).json({ success: false, message: "Something went wrong" });
  }
};

// get all slots of a specific garage 
export const getSlots = async (req:Request, res:Response) => {
  try {
    const { startIndex, endIndex }:paging = req.pagination as paging;
    
    const garage:string = (req.query.garage) as string;

    const user:Users = (req.user) as Users;

    const result:slots[][] = await getAllSlots(startIndex, garage, user.id) as slots[][];

    const totalPage:number = Math.ceil(result[1][0].count / 10);

    res.json({
      result: result[0],
      count: result[1][0].count,
      startIndex: startIndex,
      endIndex: endIndex,
      totalPage: totalPage,
    });
  } catch (error) {
    logger.error(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// get appointments between specified date range
export const appointmentsByDateRange = async (req:Request, res:Response) => {
  try {
    const { garageId, startDate, endDate }:{garageId:string,startDate:string,endDate:string} = req.body;
    const result = await getAppointsByDateRange([startDate, endDate, garageId]);
    res.status(201).json({ success: true, appointments: result });
  } catch (error) {
    logger.error(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// slot booking for customer
export const bookSlot = async (req:Request, res:Response) => {
  try {

    const user:Users = (req.user) as Users;
    
    const slotId:number = req.body.slotId;

    const result:ResultSetHeader[] = await bookSlotService(user.id, slotId) as ResultSetHeader[];

    if (result) {
      res
        .status(200)
        .json({ success: true, message: "Slot Added Successfully" });
    } else {
      res.status(404).json({ success: false, message: "Slot is not added" });
    }
  } catch (error) {
    logger.error(error);
    res.status(500).json({ success: false, message: "Something Went Wrong!" });
  }
};
