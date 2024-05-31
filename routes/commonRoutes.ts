import express from "express";
import { logout } from "../controllers/staticControllers";
import { cityList, stateList } from "../controllers/addressControllers";
import { customerInvoice } from "../controllers/invoiceControllers";
import { getUserDetails } from "../controllers/userControllers";
import { allServices } from "../controllers/serviceControllers";

const router = express.Router();

router.get("/allServices", allServices);
router.get("/address/state", stateList);
router.get("/address/city/:stateId", cityList);
router.get("/logout", logout);
router.get("/userDetails", getUserDetails);
router.post("/generate/:appointmentId", customerInvoice);

export default router;
