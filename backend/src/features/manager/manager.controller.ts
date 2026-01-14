import { Request, Response } from "express";
import httpStatus from "../../utils/httpStatus.js";
import Manager from "./manager.model.js";
import Company from "../company/company.model.js";
import managerDao from "./manager.dao.js";

const managerController = {
  /**
   * Create a new manager
   *
   * @route   POST /manager
   * @access  Public
   * @returns {Object} JSON repsonse with the created manager
   */
  createManager: async (req: Request, res: Response) => {
    const { fullName, email, companyId, mobile } = req.body;

    if (!fullName || !email || !companyId) {
      return res.status(httpStatus.BAD_REQUEST).json({
        message: "Full name, email, and companyId are required",
      });
    }

    try {
      const companyExists = await Company.findById(companyId);
      if (!companyExists) {
        return res.status(httpStatus.BAD_REQUEST).json({
          message: "Invalid Company",
        });
      }

      const existingManager = await managerDao.fetchByEmail(email);
      if (existingManager) {
        return res.status(httpStatus.CONFLICT).json({
          message: "Manager with this email already exists",
        });
      }

      const manager = await managerDao.create({
        fullName,
        email,
        companyId,
        mobile,
      });

      return res.status(httpStatus.CREATED).json({
        message: "Manager created successfully",
        manager,
      });
    } catch (error) {
      console.error("Create manager error:", error);
      return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
        message: "Internal Server Error",
      });
    }
  },

  /**
   * Fetch managers (all or by email)
   *
   * @route   GET /manager?email=
   * @access  Public
   * @returns {Object} JSON response with fetched manager
   */
  fetchManagers: async (req: Request, res: Response) => {
    const { email } = req.query;

    try {
      if (email && typeof email === "string") {
        const manager = await Manager.findOne({ email }).populate("companyId");

        if (!manager) {
          return res.status(httpStatus.NOT_FOUND).json({
            message: "Manager not found",
          });
        }

        return res.status(httpStatus.OK).json({
          message: "Manager fetched successfully",
          manager,
        });
      }

      const managers = await Manager.find().populate("companyId");

      return res.status(httpStatus.OK).json({
        message: "Managers fetched successfully",
        managers,
      });
    } catch (error) {
      console.error("Fetch managers error:", error);
      return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
        message: "Internal Server Error",
      });
    }
  },

  /**
   * Update manager by ID
   *
   * @route   PUT /manager/:id
   * @access  Public
   * @returns {Object} JSON response with updated manager
   */
  updateManager: async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
      const manager = await Manager.findByIdAndUpdate(id, req.body, {
        new: true,
        runValidators: true,
      });

      if (!manager) {
        return res.status(httpStatus.NOT_FOUND).json({
          message: "Manager not found",
        });
      }

      return res.status(httpStatus.OK).json({
        message: "Manager updated successfully",
        manager,
      });
    } catch (error) {
      console.error("Update manager error:", error);
      return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
        message: "Internal Server Error",
      });
    }
  },

  /**
   * Delete manager by ID
   *
   * @route   DELETE /manager/:id
   * @access  Public
   * @returns {Object} JSON response with deleted manager
   */
  deleteManager: async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
      const manager = await managerDao.delete(id);

      if (!manager) {
        return res.status(httpStatus.NOT_FOUND).json({
          message: "Manager not found",
        });
      }

      return res.status(httpStatus.OK).json({
        message: "Manager deleted successfully",
      });
    } catch (error) {
      console.error("Delete manager error:", error);
      return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
        message: "Internal Server Error",
      });
    }
  },
};

export default managerController;
