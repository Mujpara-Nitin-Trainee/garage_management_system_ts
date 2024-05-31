import { basicLog, Id } from "./commonInterface" 

export interface serviceBooked extends Id,basicLog{
  garage_id:number,
  service_id:number,
  price:number,
  is_deleted:boolean,
}

export interface services extends Id{
  name:string,
  description:string,
  price:number
}