import { body,ValidationChain } from "express-validator";

export const registerValidator:ValidationChain[] = [
  body("role_id").isBoolean().withMessage("Access Denied"),
  body("name")
    .isLength({ min: 3 })
    .withMessage("Name must be of 3 characters long.")
    .matches(/^[A-Za-z\s]+$/)
    .withMessage("Name must be alphabetic."),
  body("email")
    .isByteLength({ min: 6 })
    .withMessage("Please provide a valid email address")
    .isEmail()
    .withMessage("Invalid email...!!")
    .normalizeEmail(),
  body("password")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 character long...!!"),
];

export const loginValidator:ValidationChain[] = [
  body("email").isEmail().withMessage("Invalid email...!!").normalizeEmail(),
  body("password").isLength({ min: 8 }).withMessage("Invalid password...!!"),
];

export const profileValidator:ValidationChain[] = [
  body("name")
    .isLength({ min: 3 })
    .withMessage("Name must be of 3 characters long.")
    .matches(/^[A-Za-z\s]+$/)
    .withMessage("Name must be alphabetic."),
  body("area").notEmpty().withMessage("Please provide your area"),
  body("pincode")
    .notEmpty()
    .withMessage("Please provide your pincode")
    .isLength({ min: 6 })
    .withMessage("Pincode must be at least 6 digits long...!!"),
];

export const garageValidator:ValidationChain[] = [
  body("garageName")
    .isLength({ min: 3 })
    .withMessage("Name must be of 3 characters long.")
    .matches(/^[A-Za-z\s]+$/)
    .withMessage("Name must be alphabetic."),
  body("email")
    .isLength({ min: 6 })
    .withMessage("Please provide a valid email address")
    .isEmail()
    .withMessage("Invalid email...!!")
    .normalizeEmail(),
  body("cityId").notEmpty().withMessage("provide city id"),
  body("area")
    .isLength({ min: 3 })
    .withMessage("area contains aleast 3 character"),
  body("pincode")
    .isAlphanumeric()
    .withMessage("pincode must contain number only")
    .isLength({ min: 6, max: 6 })
    .withMessage("pincode must contain six digit only"),
  body("contactNumber")
    .isAlphanumeric()
    .withMessage("contact number must contain numbers")
    .isLength({ min: 10, max: 10 })
    .withMessage("contact number must be 10 digit"),
];
// body("openTime")
//     .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
//     .withMessage("provide valid open time"),
//   body("closeTime")
//     .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
//     .withMessage("provide valid open time"),
export const forgotPasswordValidator = [];
export const resetValidator = [];
export const forgotEmailValidator = () => { };
