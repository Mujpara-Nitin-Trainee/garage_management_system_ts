import {Request}  from "express";
import { FieldPacket, QueryResult } from "mysql2";

export enum appointmentStatus{
  pending = 1,
  approved = 2,
  rejected = 3,
  completed = 4
}

export enum vehicleStatus{
  pending = 1,
  completed = 2,
  inProgress = 3
}

export interface Id{
  id:number
}

export interface count{
  count:number
}

export interface basicLog{
  created_at:Date,
  updated_at:Date
}

export interface Users extends Id,basicLog{
  role_id:number,
  name:string,
  profile_pic:string,
  email:string,
  password:string,
  activate_link:string,
  password_exp:Date,
  link_exp:Date,
  is_active: Boolean,
  bio:string,
  is_verified:Boolean,
}

export interface loginLog extends Id,basicLog{
  user_id:number,
  attempt_count:number,
  attempt_sys_ip:string,
}

export interface ResultSetHeader{
  fieldCount:number,
  affectedRows:number,
  insertId:number,
  info:string,
  serverStatus:number,
  warningStatus:number,
  changedRows:number
}

export interface notify extends Id{
  customerName:string,
  startTime:Date,
  endTime:Date
}

export interface reqWithPagination extends Request{
  pagination:{page: number,
  limit: number,
  startIndex:number,
  endIndex:number,}
}

export interface insertedRows{
  insertId:number
}

export interface affectedRows{
  affectedRows:number
}

export type selectQueryHandler = [
  QueryResult,FieldPacket[]
]