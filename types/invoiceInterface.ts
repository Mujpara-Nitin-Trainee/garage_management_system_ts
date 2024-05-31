import { appointmentStatus, count } from "./commonInterface"

export interface invoiceDetail{
  garage_name:string,
  start_time:Date,
  appointment_id:number,
  customer_name:string,
  area:string,
  pincode:number,
  city_name:string,
  service_description:string,
  payment_status:number,
  price:number
}

export interface customerInvoiceDetails extends count{
  customer_name:string,
  customer_email:string,
  start_time:Date,
  appointment_id:number,
  payment_status:0,
  invoice_url:string | unknown,
  appointment_status:appointmentStatus
}