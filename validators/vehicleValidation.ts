import { body,ValidationChain } from "express-validator";

export const vehicleValidator:ValidationChain[] = [
  body("vehicleImage").notEmpty().withMessage("Please select image"),
  body("brand").notEmpty().withMessage("Please enter brand name"),
  body("model").notEmpty().withMessage("Please enter model name"),
  body("year")
    .notEmpty()
    .withMessage("Please enter model year")
    .isLength({ max: 4 }),
  body("numberPlate")
    .notEmpty()
    .withMessage("Please enter vehicle number plate")
    .matches(/^[A-Z]{2}[ -]?[0-9]{2}[ -]?[A-Z]{1,2}[ -]?[0-9]{4}$/)
    .withMessage("Please enter valid number plate"),
];
