import { basicLog, Id } from "./commonInterface"

export interface appointmentPayment extends Id,basicLog{
  appointment_id:number,
  sub_total:number,
  gst_amount:number,
  discount_per:number
  discount:number,
  status:number,
}