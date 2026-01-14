import { Request, Response } from "express";
import httpStatus from "../../utils/httpStatus.js";
import Company from "./company.model.js";

const companyController = {
  /**
   * Create a new company
   *
   * @route   POST /companies
   * @access  Public
   * @returns {Object} JSON response with created company
   */
  createCompany: async (req: Request, res: Response) => {
    const { name, email, mobile, website, industry } = req.body;

    if (!name || !email) {
      return res.status(httpStatus.BAD_REQUEST).json({
        message: "Name and email are required",
      });
    }

    try {
      const existingCompany = await Company.findOne({ email });
      if (existingCompany) {
        return res.status(httpStatus.CONFLICT).json({
          message: "Company with this email already exists",
        });
      }

      const company = await Company.create({
        name,
        email,
        mobile,
        website,
        industry,
      });

      return res.status(httpStatus.CREATED).json({
        message: "Company created successfully",
        company,
      });
    } catch (error) {
      console.error("Create company error:", error);
      return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
        message: "Internal Server Error",
      });
    }
  },

  /**
   * Fetch all companies OR fetch by email
   *
   * @route   GET /companies?email=
   * @access  Public
   * @returns {Object} JSON response with fetched created
   */
  fetchCompanies: async (req: Request, res: Response) => {
    const { email } = req.query;

    try {
      if (email && typeof email === "string") {
        const company = await Company.findOne({ email });

        if (!company) {
          return res.status(httpStatus.NOT_FOUND).json({
            message: "Company not found",
          });
        }

        return res.status(httpStatus.OK).json({
          message: "Company fetched successfully",
          company,
        });
      }

      const companies = await Company.find();

      return res.status(httpStatus.OK).json({
        message: "Companies fetched successfully",
        companies,
      });
    } catch (error) {
      console.error("Fetch companies error:", error);
      return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
        message: "Internal Server Error",
      });
    }
  },

  /**
   * Update company by ID
   *
   * @route   PUT /companies/:id
   * @access  Public
   */
  updateCompany: async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
      const company = await Company.findByIdAndUpdate(id, req.body, {
        new: true,
        runValidators: true,
      });

      if (!company) {
        return res.status(httpStatus.NOT_FOUND).json({
          message: "Company not found",
        });
      }

      return res.status(httpStatus.OK).json({
        message: "Company updated successfully",
        company,
      });
    } catch (error) {
      console.error("Update company error:", error);
      return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
        message: "Internal Server Error",
      });
    }
  },

  /**
   * Delete company by ID
   *
   * @route   DELETE /companies/:id
   * @access  Public
   * @returns {Object} JSON response with deleted company
   */
  deleteCompany: async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
      const company = await Company.findByIdAndDelete(id);

      if (!company) {
        return res.status(httpStatus.NOT_FOUND).json({
          message: "Company not found",
        });
      }

      return res.status(httpStatus.OK).json({
        message: "Company deleted successfully",
      });
    } catch (error) {
      console.error("Delete company error:", error);
      return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
        message: "Internal Server Error",
      });
    }
  },
};

export default companyController;
