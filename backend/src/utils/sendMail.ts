import "dotenv/config";
import sgMail from "@sendgrid/mail";

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

async function sendMail(recipients: string[], subject: string, body: string) {
  const mail = {
    from: "udaykumardhokia@gmail.com",
    subject,
    html: body,
    personalizations: [
      {
        to: recipients.map((email) => ({ email })),
      },
    ],
  };

  await sgMail.send(mail);
}

export default sendMail;
