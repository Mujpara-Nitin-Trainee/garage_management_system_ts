import express from "express";
import {
  appointment,
  home,
  profile,
  addVehicles,
  customerVehicleSelection,
  vehicles,
  vehiclesList,
  service,
  slot,
  payment,
} from "../controllers/staticControllers";
import {
  addVehicle,
  getAllUserVehicles,
  getUserVehicle,
  getUserVehicleDetails,
  getVehicleTypes,
  updateUserVehicle,
} from "../controllers/vehicleControllers";

import {
  showAppointments,
  customerSlotSelection,
  getAllCustomers,
} from "../controllers/customerControllers";
import upload from "../helpers/fileUploads";
import {
  getGarages,
  getGarageListing,
  getSingleGarage,
} from "../controllers/garageControllers";

import { updateProfile } from "../controllers/userControllers";
import { servicesListing } from "../controllers/serviceControllers";
import { customerInvoice } from "../controllers/invoiceControllers";
import {
  bookAppointment,
  customerNotification,
} from "../controllers/appointmentsController";
import {
  addPaymentDetails,
  getPaymentDetails,
} from "../controllers/paymentControllers";
  
import paginationMiddleware  from "../helpers/pagination";

const router = express.Router();

/// for rendering
router.get("/home", home);
router.get("/vehicle", vehicles);
router.get("/vehicleList", vehiclesList);
router.get("/service", service);
router.get("/slots", slot);
router.get("/payment", payment);

router.get("/vehicle/:id", getSingleGarage);
router.get("/addvehicle", addVehicles);
router.get("/garageList/:dist?/:lat?/:long?", getGarages);
router.get("/profile", profile);
router.get("/appointment", appointment);
router.get("/singleGarage", getSingleGarage);
router.get("/servicesList/:garageId", servicesListing);
router.get("/vehicleType", getVehicleTypes);
router.get("/viewVehicle/:type", getUserVehicle);
router.get("/viewVehicles", getAllUserVehicles);
router.post("/addVehicle", upload.single("vehicleImage"), addVehicle);
router.post("/updateVehicle", upload.single("vehicleImage"), updateUserVehicle);

router.post("/servicesList", servicesListing);
router.put("/profile/update", upload.single("thumbnail"), updateProfile);

router.get("/fetchVehicleDetails/:id", getUserVehicleDetails);
router.get("/vehicleSelection", customerVehicleSelection);
router.get("/getCustomerName", getAllCustomers);
router.get("/getslots/:garageId/:date", customerSlotSelection);
router.get("/invoice/:appointmentId", customerInvoice);
router.get("/garages", getGarageListing);

router.get("/notification", customerNotification);
router.get("/appointments", paginationMiddleware(10), showAppointments);
router.post("/bookAppointment", bookAppointment);
router.get("/payment/:appointmentId", getPaymentDetails);
router.post("/payment/:appointmentId", addPaymentDetails);


export default router;
