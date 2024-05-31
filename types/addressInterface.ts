
import { basicLog, Id } from "./commonInterface"

export interface states extends Id{
  state_name:string
}

export interface cities extends Id{
  sid:number,
  city_name:string
}

export interface userAddress{
  area:string,
  pincode:number,
  cityId:number,
  cityName:string,
  stateId:number,
  stateName:string
}

export interface addressMaster extends Id,basicLog{
  address_id:number,
  user_id:number,
  is_deleted:boolean,
}