import express from "express";
import vendorController from "./vendor.controller.js";

const router = express.Router();

router.get("/", vendorController.fetchVendors);
router.post("/", vendorController.createVendor);
router.delete("/:id", vendorController.deleteVendor);

export default router;
