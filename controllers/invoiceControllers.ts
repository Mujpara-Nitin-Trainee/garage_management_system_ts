import {Request,Response} from "express";
import ejs from "ejs";
import fs from "fs";
import path from "path";
import { generatePdf } from "../helpers/pdfGenerator";
import {
  getInvoiceDetails,
  selectByFieldName,
  updateFields,
} from "../utils/dbHandler";
import { logger } from "../helpers/logger";
import { Users } from "../types/commonInterface";
import { invoiceDetail } from "../types/invoiceInterface";

// generate invoice for customer
export const customerInvoice = async (req:Request, res:Response) => {
  try {

    const users:Users = (req.user as Users);
    
    const appointmentId:number = parseInt(req.params.appointmentId);
    let email:string;
    if (req.body.customerEmail) {
      email = req.body.customerEmail;
    } else {
      email = users.email;
    }

    let user:Users[] = await selectByFieldName("users", "email", email) as Users[];
    if (user.length < 1) {
      return res
        .status(500)
        .json({ success: false, message: "Something went wrong!" });
    }
    let invoiceDetails:invoiceDetail[] = await getInvoiceDetails([appointmentId, user[0].id]) as invoiceDetail[];

    if (invoiceDetails.length < 1) {
      return res
        .status(301)
        .json({ success: false, message: "Something went wrong!" });
    }

    let fileContent = await ejs.renderFile(
      __dirname + "/../views/partials/customerInvoice.ejs",
      {
        data: JSON.stringify(invoiceDetails),
      }
    );

    let result:string = await generatePdf(fileContent, user[0].id, appointmentId);

    let updateResult:number = await updateFields(
      "appointments",
      { invoice_url: result },
      { id: appointmentId }
    ) as number;

    if (updateResult === 0) throw "Something went wrong!";

    return res
      .status(200)
      .json({ success: true, message: "Pdf has been generated", pdf: result });
  } catch (error) {
    logger.error(error);
    return res
      .status(301)
      .json({ success: false, message: "Something went wrong!" });
  }
};

// delete generated invoice after download
export const deletePdf = async (req:Request, res:Response) => {
  try {
    const fileName:string = req.params.fileName;
    fs.unlink(
      path.join(__dirname, "../public/invoices/", fileName + ".pdf"),
      (err) => {
        if (err) {
          throw "Something went wrong!";
        } else {
          return res
            .status(200)
            .json({ success: true, message: "PDF Deleted Successfully!" });
        }
      }
    );
  } catch (error) {
    logger.error(error);
    return res
      .status(500)
      .json({ success: false, message: "Something went wrong!" });
  }
};
