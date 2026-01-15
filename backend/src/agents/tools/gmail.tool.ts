import { tool } from "ai";
import { z } from "zod";
import { gmailService } from "../../services/gmail.service.js";

export const checkRecentRepliesTool = tool({
  description: "Check for recent email replies and fetch their content",
  inputSchema: z.object({
    query: z
      .string()
      .optional()
      .describe("Optional search query for fetching emails"),
  }),
  execute: async ({ query }) => {
    try {
      const messages = await gmailService.listMessages(query || "is:unread");
      const emails = [];

      for (const msg of messages) {
        const fullMsg = await gmailService.getMessage(msg.id!);
        const subject = fullMsg.payload?.headers?.find(
          (h) => h.name === "Subject"
        )?.value;
        const from = fullMsg.payload?.headers?.find(
          (h) => h.name === "From"
        )?.value;
        const body = gmailService.extractBody(fullMsg.payload);

        emails.push({
          id: msg.id,
          subject,
          from,
          body,
          snippet: fullMsg.snippet,
        });
      }

      return {
        count: emails.length,
        emails,
      };
    } catch (error: any) {
      return { error: error.message };
    }
  },
});
