import { Request, Response } from "express";
import { gmailService } from "../../services/gmail.service.js";

let lastHistoryId: string | null = "1778324";

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
              const fromHeader = fullMsg.payload?.headers?.find(
                (h: any) => h.name === "From"
              )?.value;

              const fromEmail = fromHeader?.match(/<(.+)>/)?.[1] || fromHeader;

              console.log(`📩 Processing Message: [${msgId}] ${subject}`);
              const body = gmailService.extractBody(fullMsg.payload);

              try {
                const { default: proposalAgent } = await import(
                  "../../agents/proposal.agent.js"
                );
                const { default: Vendor } = await import(
                  "../vendor/vendor.model.js"
                );
                const { default: RFP } = await import("../rfp/rfp.model.js");
                const { default: Proposal } = await import(
                  "../proposal/proposal.model.js"
                );

                const { output: data } = await proposalAgent.generate({
                  prompt: `Subject: ${subject}\nFrom: ${fromEmail}\n\n${body}`,
                });

                if (data.isProposal && data.rfpId) {
                  console.log(
                    `✅ Identified Proposal for ${data.rfpId} from ${fromEmail}`
                  );

                  const vendor = await Vendor.findOne({ email: fromEmail });
                  if (!vendor) {
                    console.warn(
                      `Vendor not found for email: ${fromEmail}. Skipping Proposal save.`
                    );
                    continue;
                  }

                  const rfp = await RFP.findOne({ rfpId: data.rfpId });
                  if (!rfp) {
                    console.warn(
                      `RFP not found for ID: ${data.rfpId}. Skipping Proposal save.`
                    );
                    continue;
                  }

                  try {
                    await Proposal.create({
                      rfpId: rfp._id,
                      vendorId: vendor._id,
                      items: data.items,
                      totalAmount: data.totalAmount,
                      currency: data.currency,
                      deliveryTimelineDays: data.deliveryTimelineDays || 0,
                      paymentTerms: data.paymentTerms || "Standard",
                      status: "submitted",
                      additionalNotes: data.additionalNotes,
                    });
                    console.log("💾 Proposal saved to database.");

                    if (rfp.status === "sent") {
                      rfp.status = "responses_received";
                      await rfp.save();
                    }
                  } catch (dbErr: any) {
                    if (dbErr.code === 11000) {
                      console.log(
                        "Proposal already exists for this vendor/RFP."
                      );
                    } else {
                      console.error("Error saving proposal:", dbErr);
                    }
                  }
                } else {
                  console.log("Message analyzed: Not a related proposal.");
                }
              } catch (agentErr) {
                console.error("Agent processing failed:", agentErr);
              }
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
