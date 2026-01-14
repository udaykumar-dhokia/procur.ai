import { ToolLoopAgent, Output } from "ai";
import { google } from "@ai-sdk/google";
import { z } from "zod";
import "dotenv/config";

const model = google("gemini-2.5-flash");

const createRFPAgent = new ToolLoopAgent({
  model,

  instructions: `
You are an expert Request For Proposal (RFP) assistant.

Your responsibilities:
- Understand the RFP manager's unstructured request
- Identify items, quantities, specifications, and constraints
- Use the provided RFP schema tool to understand the expected structure
- Return a clean, complete, structured RFP object only
`,

  output: Output.object({
    schema: z.object({
      title: z.string({
        message: "Short descriptive title of the RFP",
      }),

      items: z
        .array(
          z.object({
            name: z.string({
              message: "Item name",
            }),

            quantity: z.number({
              message: "Required quantity",
            }),

            specifications: z.array(
              z.object({
                key: z.string(),
                value: z.string(),
              })
            ),
          })
        )
        .describe("List of requested items"),

      budget: z.object(
        {
          amount: z.number({
            message: "Budget amount",
          }),

          currency: z.string({
            message: "Currency code",
          }),
        },
        {
          message: "Budget constraints",
        }
      ),

      deliveryDeadlineDays: z.number({
        message: "Delivery deadline in days",
      }),

      paymentTerms: z.string({
        message: "Payment terms (e.g., Net 30)",
      }),

      warrantyRequirement: z.string({
        message: "Warranty requirements",
      }),

      additionalNotes: z.string({
        message: "Additional notes or conditions",
      }),

      status: z.enum([
        "draft",
        "sent",
        "responses_received",
        "evaluated",
        "awarded",
      ]),
    }),
  }),
});

export default createRFPAgent;
