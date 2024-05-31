import { appointmentStatus, count, vehicleStatus } from "./commonInterface";

export interface userAppointments{
  name:string,
  email:string,
  status:number,
  garageId:number
}

export interface userAppointmentsList extends count{
  garage_name:string,
  start_time:Date,
  appointment_id:number,
  payment_status:number,
  invoice_url:string,
  status:appointmentStatus,
  vehicle_status:vehicleStatus,
  customer_email:string,
}