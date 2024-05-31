import {Request,Response,NextFunction} from "express";
import { reqWithPagination } from "../types/commonInterface";
import { paging } from "../types/appointmentsInterface";
const  paginationMiddleware = (pageSize:number) => {
  return (req:Request, res:Response, next:NextFunction) => {
    const pageNumber:number = parseInt(req.query.page as string) || 1; // Get the current page number from the query parameters
    const startIndex:number = (pageNumber - 1) * pageSize;
    const endIndex:number = startIndex + pageSize;

    // Attach pagination data to the request object
    req.pagination = {
      page: pageNumber,
      limit: pageSize,
      startIndex,
      endIndex,
    } as paging;

    next(); // Call the next middleware
  };
};


export default paginationMiddleware;