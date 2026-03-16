import Collection from '../models/Collection.js'
import fs from "fs"

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
            imagePaths = req.files.map(file => file.path.replace(/\\/g, "/"));
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
        const collections = await Collection.find();
        res.status(200).json({ success: true, data: collections });
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
                    const oldPath = img.replace(/\\/g, "/");
                    if (fs.existsSync(oldPath)) {
                        fs.unlinkSync(oldPath);
                    }
                });
            }

            const newImages = req.files.map(file =>
                file.path.replace(/\\/g, "/")
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