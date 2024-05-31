import {Request,Response} from "express";
import { logger } from "../helpers/logger";
import {
  findVehicleStatus,
  selectByFieldName,
  updateFields,
} from "../utils/dbHandler";
import { vehicleStatus } from "../types/vehicleInterface";
import { reqWithPagination } from "../types/commonInterface";
import { paging, userVehicleAppointmentStatus } from "../types/appointmentsInterface";

// get current status of vehicle
export const getVehicleStatus = async (req:Request, res:Response) => {
  try {
    const { page, startIndex, endIndex, limit }:paging = req.pagination as paging;
    const garageId:number = parseInt(req.params.garageId);
    let result:vehicleStatus[][] = await findVehicleStatus(garageId, startIndex) as vehicleStatus[][];
    return res.status(200).json({
      success: true,
      result: result[0],
      pagination: {
        totalRecords: result[1][0].count,
        page,
        startIndex,
        endIndex,
        totalPages: Math.ceil(result[1][0].count / limit),
      },
    });
  } catch (error) {
    logger.error(error);
    return res
      .status(500)
      .json({ success: false, message: "Something went wrong!" });
  }
};

// change status of vehicle
export const changeVehicleStatus = async (req:Request, res:Response) => {
  try {
    const appointmentId:string = req.params.appointmentId;
    const status:number = req.body.status;
    let appointment:userVehicleAppointmentStatus[] = await selectByFieldName(
      "appointments",
      "id",
      appointmentId
    ) as userVehicleAppointmentStatus[];
    if (appointment.length < 1) {
      return res
        .status(500)
        .json({ success: false, message: "Something went wrong!" });
    }

    let updateResult:number = await updateFields(
      "appointments",
      { vehicle_status: status, status: 2 },
      { id: appointmentId }
    ) as number;
    if (updateResult === 0) {
      return res
        .status(500)
        .json({ success: false, message: "Something went wrong!" });
    }
    return res
      .status(200)
      .json({ success: true, message: "Status updated successfully!" });
  } catch (error) {
    logger.error(error);
    return res
      .status(500)
      .json({ success: false, message: "Something went wrong!" });
  }
};
