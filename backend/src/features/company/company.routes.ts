import express from "express";
import companyController from "./company.controller.js";

const router = express.Router();

router.post("/", companyController.createCompany);
router.get("/", companyController.fetchCompanies);
router.put("/:id", companyController.updateCompany);
router.delete("/:id", companyController.deleteCompany);

export default router;
