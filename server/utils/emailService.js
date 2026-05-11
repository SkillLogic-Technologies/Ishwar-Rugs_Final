import { createTransport } from "nodemailer";
import path from "path";
import { fileURLToPath } from "url";

// Fix for __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Logo absolute path
const logoPath = path.join(__dirname, "../../client/public/logo/Logo.png");

let transport = null;

const getTransport = () => {
  if (!transport) {
    console.log("🔧 Initializing email transport...");
    console.log("Email Config - GMAIL:", process.env.GMAIL ? "✅ Set" : "❌ Missing");
    console.log("Email Config - PASSWORD exists:", !!process.env.PASSWORD);
    transport = createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.GMAIL,
        pass: process.env.PASSWORD,
      },
    });
  }
  return transport;
};

export const sendEmail = async ({ to, subject, html }) => {
  try {
    const mailer = getTransport();

    const result = await mailer.sendMail({
      from: `"Ishwar Rugs" <${process.env.GMAIL}>`,
      to,
      subject,
      html,

      // Logo attachment for email
      attachments: [
        {
          filename: "logo.png",
          path: logoPath,
          cid: "ishwarlogo",
        },
      ],
    });

    console.log("✅ Email sent successfully:", result.messageId);
    return result;
  } catch (error) {
    console.error("❌ Email sending error:", error);
    throw error;
  }
};


export const orderConfirmationTemplate = (order) => {

  const date = new Date(order.createdAt).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric"
  });

  return `
  <div style="font-family: Arial; background:#f5f6fa; padding:40px 0;">
  
    <div style="max-width:600px;margin:auto;background:#fff;border-radius:10px;overflow:hidden;box-shadow:0 4px 15px rgba(0,0,0,0.1);">

      <div style="background:#111827;padding:25px;text-align:center;">
        
        <img src="cid:ishwarlogo" alt="Ishwar Rugs" style="height:80px;margin-bottom:10px;" />

        <p style="color:#9ca3af;margin:0;">Fine Handcrafted Rugs</p>

      </div>

      <div style="padding:30px;">

        <h2 style="color:#111827;">Order Confirmed 🎉</h2>

        <p style="color:#4b5563;">
        Thank you for your purchase. Your order has been successfully confirmed.
        </p>

        <div style="background:#f9fafb;padding:20px;border-radius:8px;margin:20px 0;">

          <p><strong>Order ID:</strong> ${order._id}</p>

          <p><strong>Date:</strong> ${date}</p>

          <p><strong>Total Amount:</strong> ₹${order.totalAmount}</p>

          <p><strong>Status:</strong> ${order.orderStatus}</p>

        </div>

        <p style="color:#6b7280;">
        We will notify you once your order is shipped.
        </p>

      </div>

      <div style="background:#f3f4f6;padding:15px;text-align:center;font-size:13px;color:#6b7280;">
        © ${new Date().getFullYear()} Ishwar Rugs. All rights reserved.
      </div>

    </div>

  </div>
  `;
};


export const orderStatusTemplate = (order) => {

  const date = new Date().toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric"
  });

  return `
  <div style="font-family: Arial;background:#f5f6fa;padding:40px 0;">
  
    <div style="max-width:600px;margin:auto;background:#fff;border-radius:10px;overflow:hidden;box-shadow:0 4px 15px rgba(0,0,0,0.1);">

      <div style="background:#111827;padding:25px;text-align:center;">

        <img src="cid:ishwarlogo" alt="Ishwar Rugs" style="height:80px;margin-bottom:10px;" />

        <p style="color:#9ca3af;margin:0;">Fine Handcrafted Rugs</p>

      </div>

      <div style="padding:30px;">

        <h2 style="color:#111827;">Order Status Updated</h2>

        <p style="color:#4b5563;">
        Your order status has been updated.
        </p>

        <div style="background:#f9fafb;padding:20px;border-radius:8px;margin:20px 0;">

          <p><strong>Order ID:</strong> ${order._id}</p>

          <p><strong>Date:</strong> ${date}</p>

          <p>
            <strong>Status:</strong> 
            <span style="color:#dc2626;font-weight:bold;">
              ${order.orderStatus}
            </span>
          </p>

          <p><strong>Total Amount:</strong> ₹${order.totalAmount}</p>

        </div>

      </div>

      <div style="background:#f3f4f6;padding:15px;text-align:center;font-size:13px;color:#6b7280;">
        © ${new Date().getFullYear()} Ishwar Rugs. All rights reserved.
      </div>

    </div>

  </div>
  `;
};