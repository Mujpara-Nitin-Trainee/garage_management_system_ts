import { basicLog, Id,count } from "./commonInterface"

export interface slots extends Id,basicLog,count{
  garage_id:number,
  start_time:string,
  end_time:string,
  availability_status:boolean,
  is_deleted:boolean,
}

export interface slotDuration{
  startTime:string,
  endTime:string,
}
