import express from "express";
import {
  appointments,
  calendar,
  dashboard,
  employee,
  inventory,
  invoice,
  tasks,
} from "../controllers/staticControllers";
import garageRoutes from "./owner/garageRoutes";
import slotRoutes from "./owner/slotRoutes";
import profileRoutes from "./owner/profileRoutes";
import serviceRoutes from "./owner/serviceRoutes";
import { findOwnerService } from "../controllers/serviceControllers";
import {
  appointmentsListing,
  bookedAppointments,
  getAppointmentCount,
  updateAppointment,
  notification,
} from "../controllers/appointmentsController";
import { daysCount } from "../controllers/userControllers";
import { generateRevenue,getPaymentStatus } from "../controllers/paymentControllers";
import {
  changeVehicleStatus,
  getVehicleStatus,
} from "../controllers/tasksControllers";

import paginationMiddleware  from "../helpers/pagination";

const router = express.Router();

// calendar
router.use("/calendar", calendar);

// slot routes
router.use("/slots", slotRoutes);

// service routes
router.use("/services", serviceRoutes);

// home page
router.get("/home", dashboard);

// garage routes
router.use("/garages", garageRoutes);

// profile routes
router.use("/profile", profileRoutes);

router.get("/appointment", appointments);

router.get("/appointmentsList", paginationMiddleware(1), appointmentsListing);
router.get("/appointmentsList/:garageId",paginationMiddleware(10),appointmentsListing);
router.get("/bookedAppointments/:id", bookedAppointments);
router.post("/updateAppointment", updateAppointment);

router.get("/inventory", inventory);

router.get("/employee", employee);

router.get("/tasks", tasks);

router.get("/invoice", invoice);

router.get("/appointmentCount", getAppointmentCount);

router.get("/notification", notification);

router.post("/ownerServices", findOwnerService);

router.get("/daysCount", daysCount);

router.get("/revenueCount", generateRevenue);
router.get("/vehicleStatus/:garageId",paginationMiddleware(10),getVehicleStatus);
router.put("/vehicleStatus/:appointmentId", changeVehicleStatus);
router.get("/paymentStatus/:appointmentId",getPaymentStatus);

export default router;
