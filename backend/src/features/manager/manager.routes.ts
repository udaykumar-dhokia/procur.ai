import express from "express";
import managerController from "./manager.controller.js";

const router = express.Router();

router.post("/", managerController.createManager);
router.get("/", managerController.fetchManagers);
router.put("/:id", managerController.updateManager);
router.delete("/:id", managerController.deleteManager);

export default router;
