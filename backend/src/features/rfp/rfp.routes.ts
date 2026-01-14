import express from "express";
import rfpController from "./rfp.controller.js";

const router = express.Router();

router.get("/", rfpController.create);

export default router;
