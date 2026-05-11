import Collection from '../models/Collection.js'
import fs from "fs"
import path from "path"

// Helper function to convert absolute path to relative
const getRelativePath = (absolutePath) => {
  const normalized = absolutePath.replace(/\\/g, "/");
  const match = normalized.match(/uploads\/.*$/);
  return match ? "/" + match[0] : normalized;
};

// Create collection...
async function createCollection(req,res) {
    try {
        const { name, description, isActive } = req.body;

        if (!name || name.trim() === "") {
            return res.status(400).json({success: false, message: "Collection name is required"});
        }

        const existing = await Collection.findOne({ name: name.trim() });

        if (existing) {
            return res.status(400).json({ success: false, message: "Collection already exists" });
        }

        let imagePaths = [];

        if (req.files && req.files.length > 0) {
            imagePaths = req.files.map(file => getRelativePath(file.path));
        }

        const collection = await Collection.create({ 
            name,
            description,
            image: imagePaths,
            isActive
        });

        res.status(201).json({ 
            success: true, 
            message: "Collection created successfully", 
            data: collection 
        });

    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
}

// Get all Collections..
async function getCollections(req, res) {
    try {
        const { isFeatured, category } = req.query;
        let filter = {};

        if (isFeatured === 'true') {
            filter.isFeatured = true;
        }

        if (category) {
            filter.category = category;
        }

        const collections = await Collection.find(filter);
        // Add heroImage field and fix image paths for frontend compatibility
        const collectionsWithHeroImage = collections.map(col => {
            const obj = col.toObject();
            // Fix image paths - add leading slash if missing
            const fixedImages = obj.image && Array.isArray(obj.image)
                ? obj.image.map(img => img.startsWith('/') ? img : `/${img}`)
                : [];
            return {
                ...obj,
                image: fixedImages,
                heroImage: fixedImages.length > 0 ? fixedImages[0] : null
            };
        });
        res.status(200).json({ success: true, data: collectionsWithHeroImage });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

// Get collection by slug..
async function getCollectionBySlug (req, res) {
    try {
        const collection = await Collection.findOne({slug: req.params.slug});
        if (!collection) {
            return res.status(404).json({ success: false, message: "Collection not found" });
        }
        res.status(200).json({ success: true, data: collection});
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
    
}

// Update collection...
async function updateCollection(req, res) {
    try {
        const { id } = req.params;

        const collection = await Collection.findById(id);

        if (!collection) {
            return res.status(404).json({ success: false, message: "Collection not found" });
        }

        if (req.files && req.files.length > 0) {

            if (collection.image && collection.image.length > 0) {
                collection.image.forEach(img => {
                    const fullPath = path.join(process.cwd(), "server", img);
                    if (fs.existsSync(fullPath)) {
                        fs.unlinkSync(fullPath);
                    }
                });
            }

            const newImages = req.files.map(file =>
                getRelativePath(file.path)
            );

            collection.image = newImages;
        }

        collection.name = req.body.name || collection.name;
        collection.description = req.body.description || collection.description;
        collection.isActive = req.body.isActive || collection.isActive;

        await collection.save();

        res.status(200).json({
            success: true,
            message: "Collection updated successfully",
            data: collection
        });

    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
}

// Delete collection...
async function deleteCollection(req, res) {
    try {
        const collection = await Collection.findById(req.params.id);

        if (!collection) {
            return res.status(404).json({ success: false, message: "Collection not found" });
        }

        if (collection.image && collection.image.length > 0) {
            collection.image.forEach(img => {
                if (fs.existsSync(img)) {
                    fs.unlinkSync(img);
                }
            });
        }

        await Collection.findByIdAndDelete(req.params.id);

        res.status(200).json({
            success: true,
            message: "Collection deleted successfully"
        });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}


export { createCollection, getCollections, getCollectionBySlug, updateCollection, deleteCollection };