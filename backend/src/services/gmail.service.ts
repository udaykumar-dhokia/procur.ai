import { google } from "googleapis";
import { OAuth2Client } from "google-auth-library";
import "dotenv/config";

export class GmailService {
  private auth: OAuth2Client;
  private gmail;

  constructor() {
    this.auth = new google.auth.OAuth2(
      process.env.GMAIL_CLIENT_ID,
      process.env.GMAIL_CLIENT_SECRET,
      "http://localhost:3000/oauth2callback"
    );

    this.auth.setCredentials({
      refresh_token: process.env.GMAIL_REFRESH_TOKEN,
    });

    this.gmail = google.gmail({ version: "v1", auth: this.auth });
  }

  async listMessages(query: string = "is:unread category:primary") {
    try {
      const res = await this.gmail.users.messages.list({
        userId: "me",
        q: query,
        maxResults: 10,
      });

      return res.data.messages || [];
    } catch (error) {
      console.error("Error listing messages:", error);
      throw error;
    }
  }

  async getMessage(id: string) {
    try {
      const res = await this.gmail.users.messages.get({
        userId: "me",
        id: id,
        format: "full",
      });
      return res.data;
    } catch (error) {
      console.error(`Error getting message ${id}:`, error);
      throw error;
    }
  }

  async watch(topicName: string) {
    try {
      const res = await this.gmail.users.watch({
        userId: "me",
        requestBody: {
          labelIds: ["INBOX"],
          topicName: topicName,
        },
      });
      console.log("🟢 Gmail watch started:", res.data);
      return res.data;
    } catch (error) {
      console.error("Error starting Gmail watch:", error);
      throw error;
    }
  }

  async stop() {
    try {
      await this.gmail.users.stop({
        userId: "me",
      });
      console.log("Gmail watch stopped");
    } catch (error) {
      console.error("Error stopping Gmail watch:", error);
    }
  }

  async getHistory(startHistoryId: string) {
    try {
      const res = await this.gmail.users.history.list({
        userId: "me",
        startHistoryId: startHistoryId,
        historyTypes: ["messageAdded"],
      });
      return res.data.history || [];
    } catch (error) {
      console.error("Error fetching history:", error);
      throw error;
    }
  }

  extractBody(payload: any): string {
    let body = "";

    const findPart = (parts: any[], mimeType: string): string | null => {
      for (const part of parts) {
        if (part.mimeType === mimeType && part.body && part.body.data) {
          return Buffer.from(part.body.data, "base64").toString("utf-8");
        } else if (part.parts) {
          const found = findPart(part.parts, mimeType);
          if (found) return found;
        }
      }
      return null;
    };

    if (payload.parts) {
      body = findPart(payload.parts, "text/plain") || "";
      if (!body) {
        body = findPart(payload.parts, "text/html") || "";
      }
    } else if (payload.body && payload.body.data) {
      body = Buffer.from(payload.body.data, "base64").toString("utf-8");
    }

    return body;
  }
}

export const gmailService = new GmailService();
