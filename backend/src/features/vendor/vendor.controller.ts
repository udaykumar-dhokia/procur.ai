import { Request, Response } from "express";
import httpStatus from "../../utils/httpStatus.js";
import vendorDao from "./vendor.dao.js";

const vendorController = {
  /**
   * Fetch vendors
   *
   * If email is provided -> fetch by email
   * Otherwise -> fetch all vendors
   * @route GET /vendor
   * @access Public
   * @returns {Object} JSON response with list of vendors
   */
  fetchVendors: async (req: Request, res: Response) => {
    const { email } = req.query;

    try {
      if (email && typeof email === "string") {
        const vendor = await vendorDao.findByEmail(email);

        if (!vendor) {
          return res.status(httpStatus.NOT_FOUND).json({
            message: "Vendor not found",
          });
        }

        return res.status(httpStatus.OK).json({
          message: "Vendor fetched successfully",
          vendor,
        });
      }

      const vendors = await vendorDao.findAll();

      return res.status(httpStatus.OK).json({
        message: "Vendors fetched successfully",
        vendors,
      });
    } catch (error) {
      console.error("Fetch vendors error:", error);

      return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
        message: "Internal Server Error",
      });
    }
  },

  /**
   * Create a new vendor
   *
   * @route   POST /vendors
   * @access  Public
   * @returns {Object} JSON response with created vendor
   */
  createVendor: async (req: Request, res: Response) => {
    const { fullName, email, mobile, categories } = req.body;

    if (!fullName || !email || !mobile || !categories) {
      return res.status(httpStatus.BAD_REQUEST).json({
        message: "Missing required fields",
      });
    }

    try {
      const vendorPayload = {
        fullName,
        email,
        mobile,
        categories,
      };

      const existingVendor = await vendorDao.findByEmail(email);
      if (existingVendor) {
        return res.status(httpStatus.CONFLICT).json({
          message: "Vendor with this email already exists",
        });
      }

      const vendor = await vendorDao.create(vendorPayload);

      return res.status(httpStatus.CREATED).json({
        message: "Vendor created successfully",
        vendor,
      });
    } catch (error) {
      return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
        message: "Internal Server Error",
      });
    }
  },

  /**
   * Delete vendor by ID
   *
   * @route   DELETE /vendors/:id
   * @access  Public
   * @returns {Object} JSON response with deleted vendor
   */
  deleteVendor: async (req: Request, res: Response) => {
    const { id } = req.params;

    if (!id) {
      return res.status(httpStatus.BAD_REQUEST).json({
        message: "Vendor ID is required",
      });
    }

    try {
      const deletedVendor = await vendorDao.delete(id);

      if (!deletedVendor) {
        return res.status(httpStatus.NOT_FOUND).json({
          message: "Vendor not found",
        });
      }

      return res.status(httpStatus.OK).json({
        message: "Vendor deleted successfully",
      });
    } catch (error) {
      console.error("Delete vendor error:", error);

      return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
        message: "Internal Server Error",
      });
    }
  },
};

export default vendorController;
