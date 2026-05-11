import Product from "../models/Product.js";
import Category from "../models/Category.js";
import Collection from "../models/Collection.js";
import fs from "fs"
import path from "path"

// Helper function to convert absolute path to relative
const getRelativePath = (absolutePath) => {
  const normalized = absolutePath.replace(/\\/g, "/");
  const match = normalized.match(/uploads\/.*$/);
  return match ? "/" + match[0] : normalized;
};

// create product...
async function createProduct(req, res) {
    try {
        const { title, category, mrp} = req.body
        if (!title || !category || !mrp) {
            return res.status(400).json({success: false, message: "Title, Category & MRP are required"})
        }
        if(mrp <= 0){
            return res.status(400).json({success: false, message: "MRP must be greater than 0"})
        }

        const data = {...req.body}

        const categoryDoc = await Category.findOne({ slug: category }) || await Category.findById(category);

        if (!categoryDoc) {
            return res.status(404).json({ success: false, message: "Invalid category" });
        }

        data.category = categoryDoc._id;

        if (req.files?.thumbnail?.length > 0) {
            data.thumbnail = getRelativePath(req.files.thumbnail[0].path);
        }
        if (req.files?.images?.length > 0) {
            data.images = req.files.images.map(file => getRelativePath(file.path));
        }

        const product = await Product.create(data)
        res.status(201).json({ success: true, message: "Product created successfully", data: product });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
}

// get products...
async function getProducts(req, res) {
    try {
        let filter = {};

        if (req.query.title) {
            filter.title = { $regex: req.query.title, $options: "i" };
        }

        if (req.query.category) {
            filter.category = req.query.category;
        }

        if (req.query.size) {
            const [len, wid] = req.query.size.split("x").map(Number);
            filter.length = len;
            filter.width = wid;
        }

        if (req.query.minPrice && req.query.maxPrice) {
            filter.price = {
                $gte: Number(req.query.minPrice),
                $lte: Number(req.query.maxPrice)
            }
        }
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 20;
        const skip = (page - 1) * limit;
        const totalProducts = await Product.countDocuments(filter);

        const products = await Product.find(filter).populate("category", "name").skip(skip).limit(limit);
        const totalPages = Math.ceil(totalProducts / limit);

        // Fix image paths - add leading slash if missing
        const fixedProducts = products.map(prod => {
            const obj = prod.toObject();
            return {
                ...obj,
                thumbnail: obj.thumbnail && !obj.thumbnail.startsWith('/') ? `/${obj.thumbnail}` : obj.thumbnail,
                images: Array.isArray(obj.images) ? obj.images.map(img => img.startsWith('/') ? img : `/${img}`) : []
            };
        });

        res.status(200).json({success: true, data: fixedProducts, totalProducts, currentPage: page, totalPages})
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

// get product by slug..
async function getProductBySlug(req, res){
    try {
        const product = await Product.findOne({slug: req.params.slug}).populate("category", "name").populate("collection", "name");;
        if(!product){
            return res.status(404).json({ success: false, message: "Product not found" })
        }
        const obj = product.toObject();
        const fixedProduct = {
            ...obj,
            thumbnail: obj.thumbnail && !obj.thumbnail.startsWith('/') ? `/${obj.thumbnail}` : obj.thumbnail,
            images: Array.isArray(obj.images) ? obj.images.map(img => img.startsWith('/') ? img : `/${img}`) : []
        };
        res.status(200).json({ success: true, data: fixedProduct })
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

// get Products By Category Slug
async function getProductsByCategorySlug(req,res){
    try {
        const { slug } = req.params;

        const category = await Category.findOne({ slug });
        if (!category) {
            return res.status(404).json({ success: false, message: "Category not found" });
        }

        const products = await Product.find({ category: category._id });

        const fixedProducts = products.map(prod => {
            const obj = prod.toObject();
            return {
                ...obj,
                thumbnail: obj.thumbnail && !obj.thumbnail.startsWith('/') ? `/${obj.thumbnail}` : obj.thumbnail,
                images: Array.isArray(obj.images) ? obj.images.map(img => img.startsWith('/') ? img : `/${img}`) : []
            };
        });

        return res.status(200).json({ success: true, category: category.name, data: fixedProducts});

  } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
  }
}

// get Products By Collection Slug
async function getProductsByCollectionSlug(req,res){
    try {
        const { slug } = req.params;

        const collection = await Collection.findOne({ slug });
        if (!collection) {
            return res.status(404).json({ success: false, message: "Collection not found" });
        }

        const products = await Product.find({ collection: collection._id });

        const fixedProducts = products.map(prod => {
            const obj = prod.toObject();
            return {
                ...obj,
                thumbnail: obj.thumbnail && !obj.thumbnail.startsWith('/') ? `/${obj.thumbnail}` : obj.thumbnail,
                images: Array.isArray(obj.images) ? obj.images.map(img => img.startsWith('/') ? img : `/${img}`) : []
            };
        });

        return res.status(200).json({ success: true, collection: collection.name, data: fixedProducts});

  } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
  }
}

// update product
async function updateProduct(req, res) {
    try {
        const { id } = req.params
        const product = await Product.findById(id)
        
        if(!product){
            return res.status(404).json({success: false, message: "Product not found" })
        }

        const updatedData = { ...req.body };

        if (req.files?.thumbnail?.length > 0) {

  if (product.thumbnail) {
    const fullPath = path.join(process.cwd(), "server", product.thumbnail);

    if (fs.existsSync(fullPath)) {
      fs.unlinkSync(fullPath);
    }
  }

  updatedData.thumbnail = getRelativePath(req.files.thumbnail[0].path);

} else {

  updatedData.thumbnail = product.thumbnail;
}
       if (req.files?.images?.length > 0) {

  if (product.images?.length) {
    product.images.forEach((img) => {
      const fullPath = path.join(process.cwd(), "server", img);

      if (fs.existsSync(fullPath)) {
        fs.unlinkSync(fullPath);
      }
    });
  }
  updatedData.images =
    req.files.images.map((file) =>
      getRelativePath(file.path)
    );

} else {
  updatedData.images = product.images;
}

        const updatedProduct = await Product.findByIdAndUpdate( id, updatedData, { new: true });
        
        res.status(200).json({ success: true, message: "Product updated successfully", data: updatedProduct})
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
}

// delete product
async function deleteProduct(req, res) {
    try {
        const product = await Product.findById(req.params.id)
        if(!product){
            return res.status(404).json({ success: false, message:"Product doesn't exist"})
        }
        else if (product.images) {
            product.images.forEach(img => fs.existsSync(img) && fs.unlinkSync(img));
        }
        
        if (product.thumbnail && fs.existsSync(product.thumbnail)) {
            fs.unlinkSync(product.thumbnail);
        }
        await Product.findByIdAndDelete(req.params.id)

        res.status(200).json({ success: true, message:"Product deleted successfully"})
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

async function userReview(req, res){
    try {
        const { rating, comment } = req.body
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({ success:false, message: "Product not found" })
        }

        const review = {
            comment,
            rating: Number(rating),
        };

        if (req.identity.type === "user") {
            review.user = req.identity.id;
        } else {
            review.guestId = req.identity.id;
        }

        product.reviews.push(review);
        product.rating = product.reviews.reduce((acc, review) => review.rating + acc, 0) / product.reviews.length;
        await product.save();

        res.status(200).json({success : true, message: "Review added successfully"})

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

export { createProduct, getProducts, getProductBySlug, getProductsByCategorySlug, getProductsByCollectionSlug, updateProduct, deleteProduct, userReview }