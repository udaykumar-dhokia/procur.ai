import { tool } from "ai";
import { z } from "zod";
import sendMail from "../../utils/sendMail.js";

export const emailTool = tool({
  description: "Send an email to the vendors",
  inputSchema: z.object({
    to: z.array(z.string()),
    subject: z.string(),
    body: z.string(),
  }),
  execute: async ({ to, subject, body }) => {
    await sendMail(to, subject, body);
    return { output: "Email sent successfully" };
  },
});
