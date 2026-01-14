import "dotenv/config";
import sgMail from "@sendgrid/mail";

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

async function sendMail(to: string, subject: string, body: string) {
  const mail = {
    to: to,
    from: "udaykumardhokia@gmail.com",
    subject: subject,
    html: body,
  };

  await sgMail
    .send(mail)
    .then(() => {
      console.log(`Mail sent to ${to}`);
    })
    .catch((error) => {
      console.error(error);
    });
}

export default sendMail;
