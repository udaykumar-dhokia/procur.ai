import { ToolLoopAgent } from "ai";
import { google } from "@ai-sdk/google";
import "dotenv/config";
import { emailTool } from "./tools/email.tool.js";

const model = google("gemini-2.5-flash");

const emailAgent = new ToolLoopAgent({
  model,
  instructions:
    "You are an email agent. You will be given a Request For Proposal (RFP) and you will generate an email based on the RFP and send it to the vendors using appropriate tool. Always use html email template.",
  tools: {
    sendEmail: emailTool,
  },
});

export default emailAgent;
