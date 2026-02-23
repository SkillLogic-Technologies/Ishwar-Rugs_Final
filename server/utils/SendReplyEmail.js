import { createTransport } from "nodemailer";

const sendReplyEmail = async ({ email, subject, replyMessage }) => {
  const transport = createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.GMAIL,
      pass: process.env.PASSWORD,
    },
  });

  const html = `
  <!DOCTYPE html>
  <html>
  <body style="font-family: Arial; background:#f5f3ef; padding:20px;">
    <div style="max-width:600px; margin:auto; background:white; padding:30px; border-radius:8px;">
      
      <h2 style="color:#2c2a29;">Reply from IshwaRugs</h2>

      <p>Hello,</p>

      <p style="line-height:1.6; color:#555;">
        ${replyMessage}
      </p>

      <hr style="margin:25px 0;" />

      <p style="font-size:13px; color:#999;">
        Thank you for contacting IshwaRugs.<br/>
        Handcrafted Luxury Carpets
      </p>

    </div>
  </body>
  </html>
  `;

  await transport.sendMail({
    from: process.env.GMAIL,
    to: email,
    subject,
    html,
  });
};

export default sendReplyEmail;