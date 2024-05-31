import path from "path";
import multer from "multer";

import {Request,NextFunction} from "express";
import { Users } from "../types/commonInterface";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/uploads");
  },
  filename: function (req, file, cb) {
    const user:Users = (req.user) as Users;
    req.body.thumbnail =
      user.email + Date.now() + path.extname(file.originalname);
    cb(null, user.email + Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

export default upload;
