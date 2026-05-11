import { sendEmail, orderConfirmationTemplate } from "../utils/emailService.js";
import crypto from "crypto";
import Payment from "../models/Payment.model.js";
import Order from "../models/Order.model.js";
import Product from "../models/Product.js";
import Cart from "../models/Cart.js";


export const verifyRazorpayPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      orderId,
    } = req.body;

    const order = await Order.findById(orderId).populate("user", "email name");

    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    // In dev mode, skip signature verification for testing
    if (process.env.NODE_ENV === "development") {
      console.log("⚠️ Dev Mode: Skipping Razorpay signature verification");
    } else {
      const body = razorpay_order_id + "|" + razorpay_payment_id;

      const expectedSignature = crypto
        .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
        .update(body)
        .digest("hex");

      if (expectedSignature !== razorpay_signature) {
        return res.status(400).json({ success: false, message: "Invalid payment signature" });
      }
    }

    if (order.payment) {
      return res.json({ success: true });
    }

    const payment = await Payment.create({
      order: order._id,
      amount: order.totalAmount,
      paymentMethod: "razorpay",
      transactionId: razorpay_payment_id,
      status: "success",
    });

    for (let item of order.items) {
      await Product.updateOne(
        { _id: item.product },
        { $inc: { stock: -item.quantity } }
      );
    }

    order.payment = payment._id;
    order.orderStatus = "Processing";
    await order.save();

  try {
  await sendEmail({
    to: order.user.email,
    subject: `Order Confirmation #${order._id}`,
    html: orderConfirmationTemplate(order),
  });
} catch (emailError) {
  console.log("Email failed:", emailError.message);
}

    // 🔥 DELETE BOTH POSSIBILITIES
    await Cart.deleteMany({
      $or: [
        { user: order.user },
        { guestId: req.cookies?.guestId }
      ]
    });

    res.clearCookie("guestId");

    return res.json({
      success: true,
      message: "Payment verified & cart deleted",
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false });
  }
};