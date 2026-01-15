import { google } from "googleapis";
import { OAuth2Client } from "google-auth-library";
import * as readline from "readline";
import "dotenv/config";
import fs from "fs";
import path from "path";
import http from "http";
import url from "url";
import { exec } from "child_process";

const SCOPES = ["https://www.googleapis.com/auth/gmail.readonly"];
// Reverting to port 3000 (standard).
// User MUST stop their backend server to use this port temporarily.
const PORT = 3000;
const REDIRECT_URI = `http://localhost:${PORT}/oauth2callback`;

async function generateToken() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  const question = (query: string): Promise<string> => {
    return new Promise((resolve) => rl.question(query, resolve));
  };

  console.log("--- Gmail Refresh Token Generator ---");

  let clientId = process.env.GMAIL_CLIENT_ID;
  let clientSecret = process.env.GMAIL_CLIENT_SECRET;

  if (!clientId) {
    clientId = await question("Enter your Client ID: ");
  }
  if (!clientSecret) {
    clientSecret = await question("Enter your Client Secret: ");
  }

  if (!clientId || !clientSecret) {
    console.error("Error: Client ID and Secret are required.");
    rl.close();
    return;
  }

  const oAuth2Client = new google.auth.OAuth2(
    clientId,
    clientSecret,
    REDIRECT_URI
  );

  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: "offline",
    scope: SCOPES,
    prompt: "consent",
  });

  console.log(`\nStarting local server on port ${PORT}...`);

  const server = http.createServer(async (req, res) => {
    if (req.url && req.url.startsWith("/oauth2callback")) {
      const qs = new url.URL(req.url, `http://localhost:${PORT}`).searchParams;
      const code = qs.get("code");

      if (code) {
        res.end(
          "Authentication successful! You can close this tab and return to the terminal."
        );
        console.log("\nCallback received! Exchanging code for tokens...");

        try {
          const { tokens } = await oAuth2Client.getToken(code);
          console.log("\n--- Tokens Generated ---");
          console.log("Access Token:", tokens.access_token);
          console.log("Refresh Token:", tokens.refresh_token);

          if (tokens.refresh_token) {
            console.log("\n✅ SUCCESS! Updating .env file...");
            const envPath = path.resolve(process.cwd(), ".env");

            let envContent = "";
            try {
              envContent = fs.readFileSync(envPath, "utf-8");
            } catch (e) {
              // File might not exist
            }

            // Simple update strategy: replace if exists, append if not
            const envVars: Record<string, string> = {
              GMAIL_CLIENT_ID: clientId!,
              GMAIL_CLIENT_SECRET: clientSecret!,
              GMAIL_REDIRECT_URI: REDIRECT_URI,
              GMAIL_REFRESH_TOKEN: tokens.refresh_token,
            };

            let newEnvContent = envContent;
            for (const [key, value] of Object.entries(envVars)) {
              if (newEnvContent.includes(`${key}=`)) {
                const regex = new RegExp(`^${key}=.*`, "m");
                newEnvContent = newEnvContent.replace(regex, `${key}=${value}`);
              } else {
                newEnvContent += `\n${key}=${value}`;
              }
            }

            fs.writeFileSync(envPath, newEnvContent.trim() + "\n");
            console.log("Updated .env file with new credentials.");

            console.log(
              "\nYou can now run 'pnpm tsx scripts/test-gmail-connection.ts' to verify."
            );
          } else {
            console.log(
              "\n⚠️  No refresh token returned. Revoke access and try again."
            );
          }
        } catch (err) {
          console.error("Error retrieving access token:", err);
        } finally {
          server.close();
          rl.close();
          process.exit(0);
        }
      } else {
        res.end("Authentication failed: No code found.");
        server.close();
        rl.close();
      }
    }
  });

  server.listen(PORT, () => {
    console.log(`Listening on ${REDIRECT_URI}`);
    console.log(
      "\nPlease open the following URL in your browser to authorize:"
    );
    console.log(authUrl);

    // Try to auto-open
    const start =
      process.platform == "darwin"
        ? "open"
        : process.platform == "win32"
        ? "start"
        : "xdg-open";
    exec(`${start} "${authUrl}"`, (err) => {
      if (err) {
        // Ignore error if auto-open fails, user can click link
      }
    });
  });
}

generateToken();
