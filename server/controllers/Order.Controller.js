import Order from "../models/Order.model.js";
import Product from "../models/Product.js";
import {getRazorpayInstance} from "../config/razorpay.js";
import { sendEmail, orderStatusTemplate } from "../utils/emailService.js";

export const createOrder = async (req, res) => {
  try {
    const { items, shippingAddress } = req.body;

    // 🛑 Items validation
    if (!items || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No items in order"
      });
    }

    // 🛑 Shipping Address Validation
    if (
      !shippingAddress ||
      !shippingAddress.fullName ||
      !shippingAddress.phone ||
      !shippingAddress.addressLine ||
      !shippingAddress.city ||
      !shippingAddress.state ||
      !shippingAddress.pincode
    ) {
      return res.status(400).json({
        success: false,
        message: "Complete shipping address is required"
      });
    }

    let orderItems = [];
    let totalAmount = 0;

    // 🔄 Loop through items
    for (let item of items) {
      const product = await Product.findById(item.product);

      if (!product) {
        return res.status(404).json({
          success: false,
          message: "Product not found"
        });
      }

      // 🔴 STOCK VALIDATION
      if (product.stock < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `${product.title} has only ${product.stock} items left in stock`
        });
      }

      const subtotal = product.price * item.quantity;

      orderItems.push({
        product: product._id,
        title: product.title,
        slug: product.slug,          // ✅ ADD SLUG
        sku: product.sku,
        image: product.thumbnail,    // ✅ Snapshot image
        quantity: item.quantity,
        price: product.price,
        subtotal
      });

      totalAmount += subtotal;
    }

    // 📝 Create Order
      const order = await Order.create({
      user: req.user._id,
      items: orderItems,
      totalAmount,
      shippingAddress
    });

    // 💳 Create Razorpay Order
    let razorpayOrder = null;
    try {
      const razorpay = getRazorpayInstance();
      razorpayOrder = await razorpay.orders.create({
        amount: totalAmount * 100,
        currency: "INR",
        receipt: order._id.toString()
      });
    } catch (razorpayError) {
      console.log("Razorpay Error:", razorpayError.message);
      // Create a mock Razorpay order for development
      razorpayOrder = {
        id: "order_" + order._id,
        amount: totalAmount * 100,
        currency: "INR",
        receipt: order._id.toString(),
        _dev_note: "Mock order created due to Razorpay API error"
      };
    }

    res.status(201).json({
      success: true,
      order,
      razorpayOrder
    });

  } catch (error) {
    console.log("Create Order Error:", error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


export const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const { id } = req.params;

    const allowedStatuses = ["Processing", "Shipped", "Delivered", "Cancelled"];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status"
      });
    }

    const order = await Order.findById(id).populate("user", "email name");

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found"
      });
    }

  order.orderStatus = status;
  await order.save();

  // 📧 Send Email to User
  try {
    await sendEmail({
      to: order.user.email,
      subject: `Your Order ${order._id} Status Updated`,
      html: orderStatusTemplate(order),
    });
  } catch (emailError) {
    console.error("Failed to send order status email:", emailError.message);
    // Email sending failed but order status was updated, so we log it but don't fail the API
  }

  res.json({
    success: true,
    message: "Order status updated successfully",
    order
  });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate("items.product")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      orders
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      orders
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


export const cancelOrder = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found"
      });
    }

    // ❌ Already Delivered ho gaya to cancel allowed nahi
    if (order.orderStatus === "Delivered") {
      return res.status(400).json({
        success: false,
        message: "Delivered order cannot be cancelled"
      });
    }

    // ❌ Already Cancelled ho to dubara cancel nahi
    if (order.orderStatus === "Cancelled") {
      return res.status(400).json({
        success: false,
        message: "Order already cancelled"
      });
    }

    // 🔄 STOCK RESTORE
    for (let item of order.items) {
      await Product.findByIdAndUpdate(
        item.product,
        { $inc: { stock: item.quantity } }
      );
    }

    // 🔄 Update Status
    order.orderStatus = "Cancelled";
    await order.save();

    res.json({
      success: true,
      message: "Order cancelled & stock restored"
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};