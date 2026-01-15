import { gmailService } from "../src/services/gmail.service.js";
import "dotenv/config";

async function testGmailConnection() {
  console.log("Testing Gmail Connection...");
  try {
    const messages = await gmailService.listMessages();
    console.log(`Found ${messages.length} messages.`);
    if (messages.length > 0) {
      console.log("Fetching first message details...");
      const firstMsg = await gmailService.getMessage(messages[0].id!);
      const subject = firstMsg.payload?.headers?.find(
        (h) => h.name === "Subject"
      )?.value;
      const from = firstMsg.payload?.headers?.find(
        (h) => h.name === "From"
      )?.value;
      console.log(`Subject: ${subject}`);
      console.log(`From: ${from}`);

      const body = gmailService.extractBody(firstMsg.payload);
      console.log("--------------------------------------------------");
      console.log("Body Content (First 500 chars):");
      console.log(
        body.trim()
          ? body.trim().substring(0, 500)
          : "[Empty or Whitespace Only]"
      );
      console.log("--------------------------------------------------");
    }
  } catch (error) {
    console.error("Gmail Connection Failed:", error);
  }
}

testGmailConnection();
