import express from "express";
import { serviceValidator } from "../../validators/serviceValidation";
import * as serviceController from "../../controllers/serviceControllers";
import { services } from "../../controllers/staticControllers";

const router = express.Router();

router.get('/', services);
router.post("/", serviceValidator, serviceController.addService);
router.delete("/:id", serviceValidator, serviceController.deleteService);
router.get('/count', serviceController.getServiceCount);
router.get('/all/:id', serviceController.getGarageNotService)


export default router;
