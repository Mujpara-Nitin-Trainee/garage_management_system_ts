import {Request,Response} from "express";
import {
  customerSlotListing,
  customersCount,
  getCustomerAppointments,
  getCustomerNames,
} from "../utils/dbHandler";
import { logger } from "../helpers/logger";
import { userAppointments, userAppointmentsList } from "../types/customerInterface";
import { slots } from "../types/slotInterface";
import { reqWithPagination, Users } from "../types/commonInterface";

// get customer details
export const getAllCustomers = async (req:Request, res:Response) => {
  try {
    const result:userAppointments[] = await getCustomerNames(1) as userAppointments[];
    res.status(201).json({ success: true, result: result });
  } catch (error) {
    logger.error(error);
    res.status(401).json({ success: false, message: "something went wrong!" });
  }
};

// get slots for specific date with garage id for customers
export const customerSlotSelection = async (req:Request, res:Response) => {
  try {
    let { garageId, date } = req.params;

    let date2:Date = new Date(new Date(date).getTime() + 24 * 60 * 60 * 1000);
    
    let newDate2:string = date2.toISOString().slice(0, 10);
    
    const result:slots[] = await customerSlotListing(parseInt(garageId), date, newDate2) as slots[];

    res.status(201).json({ success: true, result });
  } catch (error) {
    logger.error(error);
    res.status(401).json({ success: false, message: "something went wrong" });
  }
};

// get appointments of customer
export const showAppointments = async (req:Request, res:Response) => {
  try {
    const user:Users = (req.user as Users);
    const { startIndex, endIndex, limit }:{startIndex:number,endIndex:number,limit:number} = req.pagination as {page: number,
      limit: number,
      startIndex:number,
      endIndex:number};
    let appointments:userAppointmentsList[][] = await getCustomerAppointments(user.id, startIndex) as userAppointmentsList[][];
    
    return res.status(200).json({
      success: true,
      result: appointments[0],
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
      .status(301)
      .json({ success: false, message: "Something went wrong!" });
  }
};

