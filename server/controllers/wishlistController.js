import Wishlist from "../models/Wishlist.js"
import Product from "../models/Product.js"

async function toggleWishlist(req, res){
  try {
    if (!req.identity) {
      return res.status(401).json({ success: false, message: "Identity not found" });
    }
    const { productId } = req.params;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    let filter = {};

    if (req.identity.type === "user") {
      filter.user = req.identity.id;
    } else {
      filter.guestId = req.identity.id;
    }

    let wishlist = await Wishlist.findOne(filter)
    if (!wishlist) {
      wishlist = await Wishlist.create({
        user: req.identity.type === "user" ? req.identity.id : null,
        guestId: req.identity.type === "guest" ? req.identity.id : null,
        products: [productId],
      });
      return res.status(201).json({ success: true, message: "Added to wishlist"});
    }

    const exists = wishlist.products.some( (id) => id.toString() === productId );

    if (exists) {
      wishlist.products = wishlist.products.filter( (id) => id.toString() !== productId );
      await wishlist.save();
      return res.status(200).json({ success: true, message: "Removed from wishlist" });
    }

    wishlist.products.push(productId);
    await wishlist.save();

    res.status(200).json({ success: true, message: "Added to wishlist" });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

async function getWishlist(req, res){
  try {
    let filter = {};

    if (req.identity.type === "user") {
      filter.user = req.identity.id;
    } else {
      filter.guestId = req.identity.id;
    }

    const wishlist = await Wishlist.findOne(filter).populate({path: "products", populate: { path: "category", select: "name" },});
    if (!wishlist) {
      return res.status(200).json([]);
    }
    res.status(200).json({ success: true, data: wishlist.products});
        
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}

export { toggleWishlist, getWishlist }
