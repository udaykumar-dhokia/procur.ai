import express from "express";
import rfpController from "./rfp.controller.js";

const router = express.Router();

router.post("/", rfpController.create);
router.post("/:rfpId/send", rfpController.sendRFPToVendors);

export default router;
