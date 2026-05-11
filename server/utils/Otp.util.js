import { createTransport } from "nodemailer";

const sendOtp = async ({ email, subject, otp }) => {
  console.log("📧 OTP Utility - Environment Check:");
  console.log("  GMAIL:", process.env.GMAIL ? "✅ Set" : "❌ Missing");
  console.log("  PASSWORD:", process.env.PASSWORD ? "✅ Set" : "❌ Missing");
  console.log("  NODE_ENV:", process.env.NODE_ENV);

  const transport = createTransport({
    host: "smtp.gmail.com",
    port: 465,
    auth: {
      user: process.env.GMAIL,
      pass: process.env.PASSWORD,
    },
  });

 const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>IshwaRugs OTP Verification</title>
</head>
<body style="margin:0; padding:0; background-color:#f5f3ef; font-family: Arial, Helvetica, sans-serif;">

  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f5f3ef; padding:30px 0;">
    <tr>
      <td align="center">

        <!-- Main Card -->
        <table width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff; border-radius:10px; overflow:hidden; box-shadow:0 10px 30px rgba(0,0,0,0.08);">

          <!-- Header -->
          <tr>
            <td style="background-color:#2c2a29; padding:25px; text-align:center;">
              <h1 style="margin:0; color:#e6c27a; font-size:28px; letter-spacing:1px;">
                IshwaRugs
              </h1>
              <p style="margin:8px 0 0; color:#d1cfc9; font-size:14px;">
                Handcrafted Luxury Carpets
              </p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:35px 40px; text-align:center;">
              <h2 style="margin:0 0 15px; color:#2c2a29; font-size:22px;">
                OTP Verification
              </h2>

              <p style="margin:0 0 20px; color:#555; font-size:15px; line-height:1.6;">
                Hello <strong>${email}</strong>,<br/>
                Thank you for choosing <strong>IshwaRugs</strong>.
                Please use the following One-Time Password to verify your identity and continue with your checkout.
              </p>

              <!-- OTP Box -->
              <div style="
                display:inline-block;
                padding:18px 35px;
                margin:20px 0;
                background-color:#f5f3ef;
                border:1px dashed #d6b56c;
                border-radius:8px;
                font-size:34px;
                letter-spacing:6px;
                color:#2c2a29;
                font-weight:bold;
              ">
                ${otp}
              </div>

              <p style="margin:20px 0 0; color:#777; font-size:14px;">
                This OTP is valid for <strong>5 minutes</strong>.
                Please do not share it with anyone.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color:#faf9f7; padding:20px; text-align:center;">
              <p style="margin:0; color:#999; font-size:12px;">
                © ${new Date().getFullYear()} IshwaRugs. All rights reserved.
              </p>
              <p style="margin:6px 0 0; color:#999; font-size:12px;">
                Crafted with care • Designed for elegance
              </p>
            </td>
          </tr>

        </table>

      </td>
    </tr>
  </table>

</body>
</html>
`;


  try {
    const result = await transport.sendMail({
      from: process.env.GMAIL,
      to: email,
      subject,
      html,
    });
    console.log("✅ OTP Email sent successfully to:", email, "Message ID:", result.messageId);
    return result;
  } catch (error) {
    console.error("❌ OTP Email sending failed:", error.message);
    throw error;
  }
};


export default sendOtp;