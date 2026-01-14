import { tool } from "ai";
import { z } from "zod";

export const rfpSchemaTool = tool({
  description: "Provides RFP Schema for Structured Output",
  inputSchema: z.object({
    type: "object",
    properties: {
      rfpId: {
        type: "string",
        description: "Unique identifier for the RFP",
      },

      title: {
        type: "string",
        description: "Short descriptive title of the RFP",
      },

      rawInput: {
        type: "string",
        description:
          "Original unstructured user input used to generate this RFP",
      },

      items: {
        type: "array",
        description: "List of items requested in the RFP",
        items: {
          type: "object",
          properties: {
            name: {
              type: "string",
              description: "Item name",
            },
            quantity: {
              type: "number",
              minimum: 1,
              description: "Required quantity",
            },
            specifications: {
              type: "object",
              description: "Key-value technical specifications",
              additionalProperties: {
                type: "string",
              },
            },
          },
          required: ["name", "quantity"],
        },
      },

      budget: {
        type: "object",
        description: "Budget constraints",
        properties: {
          amount: {
            type: "number",
            description: "Budget amount",
          },
          currency: {
            type: "string",
            description: "Currency code (default USD)",
          },
        },
      },

      deliveryDeadlineDays: {
        type: "number",
        description: "Delivery deadline in days",
      },

      paymentTerms: {
        type: "string",
        description: "Payment terms (e.g., Net 30, Advance)",
      },

      warrantyRequirement: {
        type: "string",
        description: "Warranty requirements",
      },

      additionalNotes: {
        type: "string",
        description: "Any additional notes or conditions",
      },

      status: {
        type: "string",
        enum: ["draft", "sent", "responses_received", "evaluated", "awarded"],
        description: "Current lifecycle status of the RFP",
      },
    },
    required: ["rfpId", "title", "rawInput", "items"],
  }),
});
