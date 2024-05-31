import express from 'express';
import {
  appointmentsByDateRange,
  getSlots,
  slotBooking,
  slotDelete,
  slotUpdate,
} from "../../controllers/slotBookingController";
import { slots } from '../../controllers/staticControllers';
import  paginationMiddleware  from '../../helpers/pagination';

const router = express.Router();

router.get('/', slots);
router.get('/getAllSlots', paginationMiddleware(10), getSlots)
router.post('/insert', slotBooking)
router.post('/update', slotUpdate)
router.post('/delete/:slotId', slotDelete);
router.post('/appointmentsByDateRange', appointmentsByDateRange);

export default router;
