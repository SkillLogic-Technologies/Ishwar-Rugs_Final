import Category from '../models/Category.js'
import fs from "fs"
import path from "path"

// Helper function to convert absolute path to relative
const getRelativePath = (absolutePath) => {
  const normalized = absolutePath.replace(/\\/g, "/");
  const match = normalized.match(/uploads\/.*$/);
  return match ? "/" + match[0] : normalized;
};

// Create category...
async function createCategory(req,res) {
    try {
        const { name, description, isActive } = req.body;

        if (!name || name.trim() === "") {
            return res.status(400).json({success: false, message: "Category name is required"});
        }

        const existing = await Category.findOne({ name: name.trim() });

        if (existing) {
            return res.status(400).json({ success: false, message: "Category already exists" });
        }

        let imagePath = null;
        if (req.file) {
            imagePath = getRelativePath(req.file.path);
        }

        const category = await Category.create({ 
            name, description, image: imagePath, isActive 
        });
        res.status(201).json({ success: true, message: "Category created successfully", data: category });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
}

// Get all categories..
async function getCategories(req, res) {
    try {
        const categories = await Category.find();
        // Fix image paths - add leading slash if missing
        const fixedCategories = categories.map(cat => {
            const obj = cat.toObject();
            return {
                ...obj,
                image: obj.image && !obj.image.startsWith('/') ? `/${obj.image}` : obj.image
            };
        });
        res.status(200).json({ success: true, data: fixedCategories });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

// Get category by slug..
async function getCategoryBySlug (req, res) {
    try {
        const category = await Category.findOne({slug: req.params.slug});
        if (!category) {
            return res.status(404).json({ success: false, message: "Category not found" });
        }
        res.status(200).json({ success: true, data: category});
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
    
}

// Update category...
async function updateCategory(req, res) {
    try {
        const { id } = req.params

        const category = await Category.findById(id)
        if (!category) {
            return res.status(404).json({ success: false, message: "Category not found" });
        }

        if (req.file && category.image) {
            const fullPath = path.join(process.cwd(), "server", category.image);
            if (fs.existsSync(fullPath)) {
                fs.unlinkSync(fullPath);
            }
        }
        let newImagePath = category.image;

        if (req.file) {
            newImagePath = getRelativePath(req.file.path);
        }

        const updatedData = {
            ...req.body,
            image: newImagePath
        };

        const updatedCategory = await Category.findByIdAndUpdate( id, updatedData, { new: true });
        res.status(200).json({ success: true, message: "Category updated successfully", data: updatedCategory });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
}

// Delete Category...
async function deleteCategory(req, res) {
    try {
        const category = await Category.findById(req.params.id) 

        if (!category) {
            return res.status(404).json({ success: false, message: "Category not found" });
        }
        
        if (category.image && fs.existsSync(category.image)) {
            fs.unlinkSync(category.image);
        }
        await Category.findByIdAndDelete(req.params.id) 

        res.status(200).json({ success: true, message: "Category deleted successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}


export { createCategory, getCategories, getCategoryBySlug, updateCategory, deleteCategory };