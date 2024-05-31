
import { basicLog, Id } from "./commonInterface"

export interface vehicleBasicDetails{
  brand:string,
  model:string,
  year:number
}

export interface vehicleStatus  extends Id,vehicleBasicDetails{
  vehicle_status:number,
  register_plate_number:string,
  customer_name:string,
  count:number
}

export interface vehicleDetails extends Id{
  vehicle_type:string,
  vehicle_model:string,
  vehicle_regd_number:string,
  date:Date,
  service_name:string,
  status:number
}

export interface vehicleOwner extends Id,basicLog{
  owner_id:number,
  garage_id:number,
}

export interface vehicleMaster extends Id,vehicleBasicDetails,basicLog{
  type_id:number,
}

export interface vehicleTypes extends Id{
  name:string
}

export interface customerVehicles extends Id,vehicleBasicDetails{
  email:string,
  name:string,
  register_plate_number:string,
  condition_image:string
}