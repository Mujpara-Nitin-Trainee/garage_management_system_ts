import puppeteer from "puppeteer";
import { logger } from "../helpers/logger";

export const generatePdf = async (fileContent:string, userId:number, appointmentId:number) => {

  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setContent(fileContent);
  let fileName = `${userId}_${appointmentId}_${Date.now()}`;

  try {
    const res = await page.pdf({
      path: `./public/invoices/${fileName}.pdf`,
      format: "A4",
      printBackground: true,
    });

  } catch (error) {
    logger.error(error);
  }

  await browser.close();
  return fileName;
};
