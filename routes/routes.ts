import express from "express";

import authRoutes from "./authRoutes";

import {
  notFound,
  landingPage,
  sessionEnd,
} from "../controllers/staticControllers";
import { isAlreadyLoggedIn } from "../middlewares/isAlreadyLoggedIn";
import ownerRoutes from "./ownerRoutes";
import customerRoutes from "./customerRoutes";
import commonRoutes from "./commonRoutes";
import passport from "passport";
import { validateRole } from "../services/roleServices";
// import { customerCount } from "../controllers/customerControllers.js";
// import { serviceCount } from "../controllers/serviceControllers.js";
import {
  customerInvoice,
  deletePdf,
} from "../controllers/invoiceControllers";

const router = express.Router();

router.get("/sessionEnd", sessionEnd);

// owner routes
router.use(
  "/owner",
  passport.authenticate("jwt", {
    session: false,
    failureRedirect: "/sessionEnd",
  }),
  validateRole(1),
  ownerRoutes
);

// customer routes
router.use(
  "/customer",
  passport.authenticate("jwt", {
    session: false,
    failureRedirect: "/sessionEnd",
  }),
  validateRole(0),
  customerRoutes
);

// authentication routes
router.use("/u", isAlreadyLoggedIn, authRoutes);
// router.get('/customerCount', customerCount);
// router.get('/serviceCount', serviceCount);

// landing page
router.get("/", isAlreadyLoggedIn, landingPage);

// common routes used on both customer and owner side
router.use(
  "/",
  passport.authenticate("jwt", {
    session: false,
    failureRedirect: "/sessionEnd",
  }),
  commonRoutes
);
  
// Invoice route
router.post("/invoice/:appointmentId", customerInvoice);
router.delete("/invoice/:fileName", deletePdf);

// 404 not found
router.all("*", notFound);

export default router;
