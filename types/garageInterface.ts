import { appointmentStatus } from "./commonInterface"

export interface garages extends garageDuration{
  garage_id:number,
  garage_name:string,
  thumbnail:string,
  status:appointmentStatus,
  email:string,
  contact_number:number,
  description:string
}

export interface garageDuration{
  open_time:string,
  close_time:string
}

export interface garageAddressInterface{
  latitude:number,
  longitude:number,
  area:string,
  pincode:number,
  cityId:number,
  stateId:number
}