import { basicLog, count, Id, appointmentStatus,vehicleStatus } from "./commonInterface"

export interface paging{
  page:number,
  startIndex:number,
  endIndex:number,
  limit:number
}

export interface appointments extends Id,count{
  customerName:string,
  garageName:string
  date: string,
  startTime: string,
  endTime: string,
  status:appointmentStatus,
  vehicle_status:vehicleStatus
}

export interface appointmentState{
  pending:number,
  successful:number,
  cancelled:number
}

export interface userAppointments{
  name:string,
  start_time:Date,
  end_time:Date
}

export interface userVehicleAppointmentStatus extends Id,basicLog{
  slot_id:number,
  customer_id:number,
  status:appointmentStatus,
  invoice_url:string,
  comment:string,
  vehicle_status:vehicleStatus,
  vehicle_id:number
}
