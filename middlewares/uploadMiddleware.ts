import multer from "multer";
import upload from "../helpers/fileUploads";
import { Request,Response,NextFunction } from "express";

const handleMulterError = (err:Error, req:Request, res:Response, next:NextFunction) => {
  if (err instanceof multer.MulterError) {
    return res.status(400).json({ error: err.message });
  } else if (err) {
    return res
      .status(500)
      .json({ error: "An error occurred while uploading the file." });
  }
  next();
};

export const uploadMiddleware = (req:Request, res:Response, next:NextFunction) => {
  upload.single("thumbnail")(req, res, function (err) {
    handleMulterError(err, req, res, next);
  });
};
