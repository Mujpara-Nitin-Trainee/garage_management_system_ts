import { body, ValidationChain } from "express-validator";

export const serviceValidator:ValidationChain[] = [
  body("serviceId").notEmpty().withMessage('Please select a service'),
  body('price').notEmpty().withMessage("Please provide price"),
  body('price').isInt().withMessage('please provide a valid price')
];