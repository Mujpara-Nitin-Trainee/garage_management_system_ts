import {Request,Response} from "express";
import bcrypt from "bcrypt";
import { logger } from "../helpers/logger";
import {
  countRevenue,
  insertData,
  selectByFieldName,
  updateFields,
  getPaymentStatusService
} from "../utils/dbHandler";
import { appointmentPayment } from "../types/paymentInterface";
import { Users } from "../types/commonInterface";
import { userAppointments } from "../types/appointmentsInterface";

// get payment details of an appointment
export const getPaymentDetails = async (req:Request, res:Response) => {
  try {
    const appointmentId:string = req.params.appointmentId;

    let paymentDetails:appointmentPayment[] = await selectByFieldName(
      "appointment_payments",
      "appointment_id",
      appointmentId
    ) as appointmentPayment[];

    if (paymentDetails.length != 1) {
      return res.render("404", { title: "Some problem occured!" });
    }
    let finalAmount = parseFloat(paymentDetails[0].sub_total.toString());
    if (paymentDetails[0].gst_amount.toString() != null) {
      finalAmount += parseFloat(paymentDetails[0].gst_amount.toString());
    }
    if (paymentDetails[0].discount != null) {
      finalAmount += parseFloat(paymentDetails[0].discount.toString());
    }
    return res.render("customer/paymentDetails", { finalAmount });
  } catch (error) {
    logger.error(error);
    return res
      .status(301)
      .json({ success: false, message: "Something went wrong!" });
  }
};

// add payment details 
export const addPaymentDetails = async (req:Request, res:Response) => {
  try {
    for (let element in req.body) {
      if (req.body[element] == "") {
        req.body[element] = null;
      }
    }

    let {
      paymentType,
      bankName,
      cardNumber,
      accountHolder,
      cvv,
      expiryDate,
      upi,
      finalAmount,
    }:{paymentType:string,bankName:string,cardNumber:string,accountHolder:string,cvv:string,expiryDate:Date,upi:string,finalAmount:number} = req.body;
    const appointmentId:string = req.params.appointmentId;

    if (paymentType == "card") {
      let salt:string = await bcrypt.genSalt(10);
      cardNumber = await bcrypt.hash(cardNumber, salt);
      cvv = await bcrypt.hash(cvv, salt);
    }
    if (paymentType == "cash") {
      bankName = "";
    }

    let result:number = await insertData(
      "payment_master",
      [
        "appointment_id",
        "payment_type",
        "bank_name",
        "card_number",
        "account_holder",
        "cvv",
        "card_expiry_date",
        "upi_id",
        "amount",
      ],
      [
        appointmentId,
        paymentType,
        bankName,
        cardNumber.toString(),
        accountHolder,
        cvv.toString(),
        expiryDate.toString(),
        upi,
        finalAmount.toString(),
      ]
    ) as number;
    if (result === 0) {
      return res
        .status(301)
        .json({ success: false, message: "Something went wrong!" });
    }

    let updateStatus:number = await updateFields(
      "appointment_payments",
      { status: 2 },
      { appointment_id: appointmentId }
    ) as number;

    if (updateStatus === 0) {
      return res
        .status(301)
        .json({ success: false, message: "Something went wrong!" });
    }

    let updateAppointment:number = await updateFields(
      "appointments",
      { status: 4 },
      { id: appointmentId }
    ) as number;

    if (updateAppointment === 0) {
      return res
        .status(301)
        .json({ success: false, message: "Something went wrong!" });
    }

    const user:Users = (req.user as Users);

    return res.status(200).json({
      success: true,
      message: "Payment done successfully",
      customerEmail: user.email,
    });
  } catch (error) {
    logger.error(error);
    return res
      .status(301)
      .json({ success: false, message: "Something went wrong!" });
  }
};

// generate revenue for a garage owner
export const generateRevenue = async (req:Request, res:Response) => {
  try {
    
    const user:Users = (req.user as Users);

    let result:number = await countRevenue(user.id) as number;
    const formatter = Intl.NumberFormat("en", { notation: "compact" });
    let result2:string = formatter.format(result);
    res.status(200).json({ success: true, result2 });
  } catch (error) {
    logger.error(error);
    res.status(301).json({ success: false, message: "Something went wrong!" });
  }
};

export const getPaymentStatus = async (req:Request, res:Response) => {
  try {
    const appointmentId:number = parseInt(req.params.appointmentId);
    const result:userAppointments[] = await getPaymentStatusService(appointmentId) as userAppointments[];
    res.status(200).json({ success: true, result });
  } catch (err) {
    logger.error(err);
    res.status(301).json({ success: false, message: "Something went wrong!" });
  }
};