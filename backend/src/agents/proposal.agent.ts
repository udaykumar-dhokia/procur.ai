import { ToolLoopAgent, Output } from "ai";
import { google } from "@ai-sdk/google";
import { z } from "zod";
import "dotenv/config";

const model = google("gemini-2.5-flash");

const proposalAgent = new ToolLoopAgent({
  model,

  instructions: `
You are an expert Procurement Assistant.
Your job is to process incoming emails from vendors and determine if they are a formal **Proposal/Quotation response to an RFP**.

Responsibilities:
1. **Analyze** the email subject and body.
2. **Determine Applicability**:
   - If the email is NOT a proposal/quote for an RFP, set 'isProposal' to false.
   - If it IS a proposal, set 'isProposal' to true.
3. **Extract Data**:
   - **RFP ID**: Look for patterns like "RFP-XXXX" in subject or body.
   - **Items**: Extract line items, quantities, unit prices, and total prices.
   - **Terms**: Delivery timeline, payment terms, validity.
   - **Total Amount**: The grand total of the quote.

Constraints:
- Return a structured JSON object.
- If 'isProposal' is false, leave other fields empty.
`,

  output: Output.object({
    schema: z.object({
      isProposal: z
        .boolean()
        .describe(
          "True if this email is a vendor proposal/quote response to an RFP"
        ),

      rfpId: z
        .string()
        .optional()
        .describe("The RFP ID found in the email (e.g. RFP-1234)"),

      vendorEmail: z
        .string()
        .optional()
        .describe("The email address of the vendor sending the proposal"),

      items: z
        .array(
          z.object({
            name: z.string(),
            quantity: z.number(),
            unitPrice: z.number(),
            totalPrice: z.number(),
            usage: z
              .string()
              .optional()
              .describe("Any remarks or specs for this item"),
          })
        )
        .optional(),

      totalAmount: z.number().optional(),
      currency: z.string().default("USD"),

      deliveryTimelineDays: z
        .number()
        .optional()
        .describe("Delivery time in days"),
      paymentTerms: z.string().optional(),
      validityDate: z
        .string()
        .optional()
        .describe("ISO date string if available"),

      additionalNotes: z.string().optional(),
    }),
  }),
});

export default proposalAgent;
