import { Request, Response } from "express";
import { gmailService } from "../../services/gmail.service.js";

let lastHistoryId: string | null = null;

/**
 * Handle webhook from Gmail
 *
 * @returns void
 */
export const handleWebhook = async (req: Request, res: Response) => {
  try {
    const message = req.body.message;

    if (!message || !message.data) {
      res.status(400).send("Invalid message format");
      return;
    }
    const dataDetails = Buffer.from(message.data, "base64").toString("utf-8");
    const parsedData = JSON.parse(dataDetails);

    const { emailAddress, historyId } = parsedData;

    res.status(200).send("Processed");

    if (lastHistoryId && parseInt(historyId) > parseInt(lastHistoryId)) {
      console.log(
        `Fetching changes from History ID: ${lastHistoryId} to ${historyId}`
      );

      const history = await gmailService.getHistory(lastHistoryId);

      for (const record of history) {
        if (record.messagesAdded) {
          for (const msgInfo of record.messagesAdded) {
            const msgId = msgInfo.message?.id;
            if (msgId) {
              const fullMsg = await gmailService.getMessage(msgId);
              const subject = fullMsg.payload?.headers?.find(
                (h: any) => h.name === "Subject"
              )?.value;
              console.log(`📩 New Message: [${msgId}] ${subject}`);
            }
          }
        }
      }
    } else {
      console.log(
        `First event or unordered. Setting historyId to ${historyId}. (Future events will trigger fetch)`
      );
    }

    lastHistoryId = historyId;
  } catch (error) {
    console.error("Error processing webhook:", error);
    res.status(500).send("Error");
  }
};
