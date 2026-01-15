import { Request, Response } from "express";
import createRFPAgent from "../../agents/rfp.agent.js";
import httpStatus from "../../utils/httpStatus.js";
import rfpDao from "./rfp.dao.js";
import { customAlphabet } from "nanoid";
import emailAgent from "../../agents/email.agent.js";

const customNanoId = customAlphabet("0123456789", 4);

const rfpController = {
  /**
   * Create a new RFP
   *
   * @route   POST /rfp
   * @access  Private
   * @returns {Object} JSON response with created RFP
   */
  create: async (req: Request, res: Response) => {
    const { managerId, prompt } = req.body;
    try {
      const { output } = await createRFPAgent.generate({
        prompt,
      });

      const rfpId = customNanoId();
      const rfp = await rfpDao.create({
        rfpId: `RFP-${rfpId}`,
        rawInput: prompt,
        managerId,
        ...output,
      });

      return res.status(httpStatus.CREATED).json({
        rfp,
      });
    } catch (error) {
      console.log(error);
      return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
        message: "Internal Server Error",
      });
    }
  },

  /**
   * Send RFP to vendors
   *
   * @route   POST /rfp/:rfpId/send
   * @access  Private
   * @returns {Object} JSON response with sent RFP
   */
  sendRFPToVendors: async (req: Request, res: Response) => {
    const { rfpId } = req.params;
    const { vendors } = req.body;
    try {
      const rfp = await rfpDao.findById(rfpId);
      if (!rfp) {
        return res.status(httpStatus.NOT_FOUND).json({
          message: "RFP not found",
        });
      }

      const { output } = await emailAgent.generate({
        prompt: `Receipients: ${vendors.join(", ")}. RFP: ${JSON.stringify(
          rfp
        )}`,
      });

      return res.status(httpStatus.OK).json({
        output,
      });
    } catch (error) {
      return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
        message: "Internal Server Error",
      });
    }
  },
};

export default rfpController;
