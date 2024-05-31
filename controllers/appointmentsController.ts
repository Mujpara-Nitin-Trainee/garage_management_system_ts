import { logger } from "../helpers/logger";
import {Request, Response} from "express";
import {
  getOwnerGarages,
  countAppointments,
  getAppointments,
  getBookedAppointments,
  handleUpdateAppointments,
  insertData,
  selectByFieldName,
  selectByFieldNames,
  updateFields,
  getNotifications,
  userNotification,
} from "../utils/dbHandler";
import { appointments, appointmentState, paging } from "../types/appointmentsInterface";
import { notify,Users } from "../types/commonInterface";
import { garages } from "../types/garageInterface";
import { slots } from "../types/slotInterface";
import { serviceBooked } from "../types/serviceInterface";


// get all the appointments of a specific garage for owner
export const appointmentsListing = async (req:Request, res:Response) => {
  try {
    
    const { page, startIndex, endIndex, limit }:paging = req.pagination as paging;

    const user:Users = (req.user as Users);

    let ownerId:number = user.id;
    
    const garages:garages[] = await getOwnerGarages(ownerId) as garages[];

    if (!garages) {
      res.status(301).json({ success: false, message: "Something went wrong" });
    }

    let garage:number = garages[0].garage_id;
    garage = parseInt(req.params.garageId) || garage;

    const appointments:appointments[][] = await getAppointments([
      garage,
      user.id,
      startIndex,
      garage,
      user.id,
    ]) as appointments[][];
    appointments[0].forEach((appointment) => {
      appointment.date = appointment.startTime.slice(0, 10);
      appointment.startTime = appointment.startTime.slice(11, 16);
      appointment.endTime = appointment.endTime.slice(11, 16);
    });
    res.status(201).json({
      success: true,
      appointments: appointments[0],
      pagination: {
        totalRecords: appointments[1][0].count,
        page,
        startIndex,
        endIndex,
        totalPages: Math.ceil(appointments[1][0].count / limit),
      },
    });
  } catch (error) {
    logger.error(error);
    res.status(401).json({ success: false, message: "Something went wrong!" });
  }
};

// get all the booked appointments for owner
export const bookedAppointments = async (req:Request, res:Response) => {
  try {

    const user:Users = (req.user as Users);

    let result:appointments[] = await getBookedAppointments(user.id) as appointments[];

    let appointments:appointments[] = [];
    let temp:appointments;

    result.forEach((res:appointments) => {
      
      
      temp.garageName = res.garageName;
      temp.customerName = res.customerName;
      temp.date = res.startTime.slice(0, 11);
      temp.startTime = res.startTime.slice(11, 16);
      temp.endTime = res.endTime.slice(11, 16);
      appointments.push(temp);
    });

    res.status(201).json({ success: false, appointments });
  } catch (error) {
    logger.error(error);
    res.status(401).json({ success: false, message: "Something went wrong!" });
  }
};

// get number of appointments booked
export const getAppointmentCount = async (req:Request, res:Response) => {
  try {

    const user:Users = (req.user as Users);

    const { pending, successful, cancelled }:appointmentState = await countAppointments(
      user.id
    ) as appointmentState;
    res.status(201).json({ success: true, pending, successful, cancelled });
  } catch (error) {
    logger.error(error);
    res.status(401).json({ success: false, message: "Something went wrong!" });
  }
};

// update status of appointment
export const updateAppointment = async (req:Request, res:Response) => {
  try {
    let { appointmentId, id }:{appointmentId:number,id:number} = req.body;
    let result = await handleUpdateAppointments(
      id == 1 ? 2 : 3,
      appointmentId
    );
    if (!result) throw "Something went wrong";

    res.status(201).json({
      success: true,
      message: "Appointment updated successfully!",
    });
  } catch (error) {
    logger.error(error);
    res.status(501).json({ success: false, message: "Something went wrong!" });
  }
};

// appointment booking by customer
export const bookAppointment = async (req:Request, res:Response) => {
  try {

    const user:Users = (req.user as Users);

    const { serviceId, vehicleId, slotId }:{serviceId:string,vehicleId:string,slotId:string} = req.body;
    let slot:slots[] = await selectByFieldName("slot_master", "id", slotId) as slots[];
    if (!slot[0].availability_status) {
      return res
        .status(403)
        .json({ success: false, message: "Selected slot is already used" });
    }

    let userId:string = user.id.toString();

    let appointmentResult:number = await insertData(
      "appointments",
      ["slot_id", "customer_id", "vehicle_id", "status"],
      [slotId, userId, vehicleId, "1"]
    )as number;
    
    if (appointmentResult === 0) {
      return res
        .status(500)
        .json({ success: false, message: "Something went wrong!" });
    }

    let appointmentId:number = appointmentResult;
    let sub_total:number = 0;

    let servicePromise = new Promise((resolve) => {
    
      serviceId?.split(",").forEach(async (element) => {
        try {
          let serviceResult:serviceBooked[] = await selectByFieldNames("garage_has_services", {
            id: element,
          })as serviceBooked[];
          if (serviceResult.length < 1) {
            return res
              .status(500)
              .json({ success: false, message: "Something went wrong!" });
          }
          sub_total += serviceResult[0].price;
          let appointmentServiceResult:number = await insertData(
            "appointment_services",
            ["service_id", "appointment_id"],
            [element, appointmentId.toString()]
          )as number;
          if (appointmentServiceResult === 0) {
            return res
              .status(500)
              .json({ success: false, message: "Something went wrong!" });
          }
          resolve(sub_total);
        } catch (error) {
          logger.error(error);
          return res
            .status(501)
            .json({ success: false, message: "Something went wrong!" });
        }
      });
    });

    await servicePromise;

    let gst_amount:number = (sub_total * 12) / 100;

    let paymentResult:number = await insertData(
      "appointment_payments",
      ["appointment_id", "sub_total", "gst_amount"],
      [appointmentId.toString(), sub_total.toString(), gst_amount.toString()]
    ) as number;
    if (paymentResult === 0) {
      return res
        .status(500)
        .json({ success: false, message: "Something went wrong!" });
    }

    let slotResult:number = await updateFields(
      "slot_master",
      { availability_status: "0" },
      { id: slotId }
    ) as number;
    if (slotResult === 0) {
      return res
        .status(500)
        .json({ success: false, message: "Something went wrong!" });
    }

    return res.status(200).json({
      success: true,
      message: "Appointment has been booked successfully",
    });
  } catch (error) {
    logger.error(error);
    res.status(501).json({ success: false, message: "Something went wrong!" });
  }
};

// get pending appointments for owner to count notifications
export const notification = async (req:Request, res:Response) => {
  try {

    const user:Users = (req.user as Users);

    let userId:number = user.id;
    let notifications:notify[] = await getNotifications(userId) as notify[];

    if (!notifications) {
      logger.error(Error);
      res.status(301).json({ success: false, message: "Something went wrong" });
    }

    res.status(200).json({ success: true, notifications });
  } catch (error) {
    logger.error(error);
    res.status(501).json({ success: false, message: "Something went wrong!" });
  }
};

// get pending appointments for customer to count notifications
export const customerNotification = async (req:Request, res:Response) => {
  try {

    const user:Users = (req.user as Users);
    
    let userId:number = user.id;

    let notification:notify[] = await userNotification(userId) as notify[];

    if (!notification) {
      logger.error(Error);
      res.status(301).json({ success: false, message: "Something went wrong" });
    }

    res.status(200).json({ success: true, notification });
  } catch (error) {
    logger.error(Error);
    res.status(501).json({ success: false, message: "Something went wrong!" });
  }
};
