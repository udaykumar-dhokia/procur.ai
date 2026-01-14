import createRFPAgent from "../../agents/rfp.agent.js";
import httpStatus from "../../utils/httpStatus.js";

const rfpController = {
  create: async (req, res) => {
    try {
      const { output } = await createRFPAgent.generate({
        prompt: `
        We are requesting proposals for the supply of 10 Computers with 16 GB RAM, 512 GB SSD, and 24-27 inch displays, along with 10 monitors featuring 27-inch QHD IPS screens.

        The total budget is INR 4,00,000, and delivery must be completed within 30 days.

        Payment terms are Net 30, and all products must include a minimum 1-year warranty.

        Vendors should include delivery timelines and warranty details in their proposals.
        `,
      });

      return res.status(httpStatus.OK).json({
        output,
      });
    } catch (error) {
      console.log(error);
      return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
        message: "Internal Server Error",
      });
    }
  },
};

export default rfpController;
