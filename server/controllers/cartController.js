import Cart from "../models/Cart.js"
import Product from "../models/Product.js"

async function addToCart(req, res) {
  try {
    if (!req.identity) {
      return res.status(401).json({
        success: false,
        message: "Identity not found",
      });
    }

    const { productId } = req.params;
    const { quantity = 1 } = req.body;

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    let cart;

    // ✅ USER FLOW
    if (req.identity.type === "user") {

      cart = await Cart.findOne({ user: req.identity.id });

      if (!cart) {
        cart = await Cart.create({
          user: req.identity.id,
          items: [],
          cartTotal: 0,
        });
      }

    } else {
      // ✅ GUEST FLOW

      cart = await Cart.findOne({ guestId: req.identity.id });

      if (!cart) {
        cart = await Cart.create({
          guestId: req.identity.id,
          items: [],
          cartTotal: 0,
        });
      }
    }

    // ✅ ADD / UPDATE PRODUCT
    const itemIndex = cart.items.findIndex(
      (item) => item.product.toString() === productId
    );

    if (itemIndex > -1) {
      cart.items[itemIndex].quantity += quantity;
      cart.items[itemIndex].total =
        cart.items[itemIndex].quantity *
        cart.items[itemIndex].price;
    } else {
      cart.items.push({
        product: productId,
        quantity,
        price: product.price,
        total: product.price * quantity,
      });
    }

    // ✅ RECALCULATE TOTAL
    cart.cartTotal = cart.items.reduce(
      (acc, item) => acc + item.total,
      0
    );

    await cart.save();

    return res.status(200).json({
      success: true,
      message: "Added to cart",
      items: cart.items,
      cartTotal: cart.cartTotal,
    });

  } catch (error) {
    console.error("Add To Cart Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to add item",
    });
  }
}

async function getCart(req, res) {
  try {
    if (!req.identity) {
      return res.status(400).json({ success: false, message: "Identity not found", });
    }

    let filter = {};

    if (req.identity.type === "user") {
      filter.user = req.identity.id;
    } else {
      filter.guestId = req.identity.id;
    }

    const cart = await Cart.findOne(filter).populate({ path: "items.product",
      populate: { path: "category", select: "name" }
    });

    if (!cart) {
      return res.status(200).json({ success: true, items: [] });
    }

    // Filter out items with null products
    const validItems = cart.items.filter(item => item.product !== null);

    // If cart had invalid items, remove them
    if (validItems.length < cart.items.length) {
      cart.items = validItems;
      cart.cartTotal = validItems.reduce((acc, item) => acc + (item.total || 0), 0);
      await cart.save();
    }

    res.status(200).json({ success: true, items: validItems, cartTotal: cart.cartTotal, });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

async function updateQuantity(req, res) {
  try {
    const { itemId, action } = req.body;

    let filter = {};

    if (req.identity.type === "user") {
      filter.user = req.identity.id;
    } else {
      filter.guestId = req.identity.id;
    }

    const cart = await Cart.findOne(filter);
    if (!cart) {
      return res.status(404).json({ success: false, message: "Cart not found" });
    }

    const item = cart.items.id(itemId);
    if (!item) {
      return res.status(404).json({ success: false, message: "Item not found" });
    }

    if (action === "inc") {
      item.quantity += 1;
    }

    if (action === "dec" && item.quantity > 1) {
      item.quantity -= 1;
    }

    item.total = item.quantity * item.price;

    cart.cartTotal = cart.items.reduce(
      (acc, i) => acc + i.total,
      0
    );

    await cart.save();

    const updatedCart = await Cart.findOne(filter).populate({path: "items.product",
      populate: { path: "category", select: "name" },
    });

    res.status(200).json({ success: true, items: updatedCart.items, cartTotal: updatedCart.cartTotal });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

async function removeFromCart(req, res) {
  try {
    const { itemId } = req.body;

    let filter = {};

    if (req.identity.type === "user") {
      filter.user = req.identity.id;
    } else {
      filter.guestId = req.identity.id;
    }

    const cart = await Cart.findOne(filter);
    if (!cart) {
      return res.status(404).json({ success: false, message: "Cart not found" });
    }

    cart.items = cart.items.filter(
      (item) => item._id.toString() !== itemId
    );

    cart.cartTotal = cart.items.reduce(
      (acc, i) => acc + i.total,
      0
    );
    await cart.save();

    const updatedCart = await Cart.findOne(filter).populate({ path: "items.product",
      populate: { path: "category", select: "name" },
    });

    res.status(200).json({ success: true, items: updatedCart.items, cartTotal: updatedCart.cartTotal });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export { addToCart, getCart, updateQuantity, removeFromCart }