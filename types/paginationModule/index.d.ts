export {}

declare global {
  namespace Express {
    export interface Request{
      pagination:{page: number,
        limit: number,
        startIndex:number,
        endIndex:number,}
    }
  }
}