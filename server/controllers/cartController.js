import Cart from "../models/Cart.js"
import Product from "../models/Product.js"

async function addToCart(req, res) {
  try {
    if (!req.identity) {
      return res.status(401).json({ success: false, message: "Identity not found" });
    }
    const { productId } = req.params
    const { quantity = 1 } = req.body;
    const product = await Product.findById(productId)

    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    let filter = {};

    if (req.identity.type === "user") {
      filter.user = req.identity.id;
    } else {
      filter.guestId = req.identity.id;
    }

    let cart = await Cart.findOne(filter);
    if (!cart) {
      const itemTotal = product.price * quantity;
      cart = await Cart.create({
        user: req.identity.type === "user" ? req.identity.id : null,
        guestId: req.identity.type === "guest" ? req.identity.id : null,
        items: [{ product: productId, quantity, price: product.price, total: itemTotal }],
        cartTotal: itemTotal,
      });
      return res.status(201).json({
        success: true, message: "Added to cart", items: cart.items,
        cartTotal: cart.cartTotal
      });
    }

    const itemIndex = cart.items.findIndex(
      (item) => item.product.toString() === productId
    );

    if (itemIndex > -1) {
      cart.items[itemIndex].quantity += quantity;
      cart.items[itemIndex].total = cart.items[itemIndex].quantity * cart.items[itemIndex].price;
    } else {
      cart.items.push({ product: productId, quantity, price: product.price, total: product.price * quantity });
    }

    cart.cartTotal = cart.items.reduce(
      (acc, item) => acc + item.total,
      0
    );
    await cart.save();

    res.status(200).json({
      success: true, message: "Added to cart", items: cart.items,
      cartTotal: cart.cartTotal
    });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
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

    res.status(200).json({ success: true, items: cart.items, cartTotal: cart.cartTotal, });

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

    res.status(200).json({ success: true, items: updatedCart.items });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export { addToCart, getCart, updateQuantity, removeFromCart }