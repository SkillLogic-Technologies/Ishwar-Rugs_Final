import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '.env') });

// Import models
import Category from './models/Category.js';
import Collection from './models/Collection.js';
import Product from './models/Product.js';
import { v4 as uuidv4 } from 'uuid';

const generateSKU = () => uuidv4().slice(0, 12).toUpperCase();

const seedDatabase = async () => {
  try {
    console.log('🔄 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    console.log('🗑️ Clearing existing data...');
    await Category.deleteMany({});
    await Collection.deleteMany({});
    await Product.deleteMany({});

    // Create Categories
    console.log('📂 Creating categories...');
    const categories = await Category.create([
      {
        name: 'Contemporary',
        slug: 'contemporary',
        description: 'Modern and contemporary carpet designs',
        image: '/uploads/category/1769659266543-oriental.jpeg',
        isActive: true
      },
      {
        name: 'Traditional',
        slug: 'traditional',
        description: 'Classic and traditional carpet collections',
        image: '/uploads/category/1769659302008-wool.jpeg',
        isActive: true
      },
      {
        name: 'Luxury',
        slug: 'luxury',
        description: 'Premium luxury carpet collections',
        image: '/uploads/category/1769659349863-tufted.jpeg',
        isActive: true
      },
      {
        name: 'Wool',
        slug: 'wool',
        description: 'High-quality wool carpets',
        image: '/uploads/category/1769659383986-silk.jpeg',
        isActive: true
      },
      {
        name: 'Silk',
        slug: 'silk',
        description: 'Beautiful silk carpet designs',
        image: '/uploads/category/1769659412232-runner.jpeg',
        isActive: true
      },
      {
        name: 'Designer',
        slug: 'designer',
        description: 'Exclusive designer collections',
        image: '/uploads/category/1769659441482-persian.jpeg',
        isActive: true
      }
    ]);
    console.log(`✅ Created ${categories.length} categories`);

    // Create Collections
    console.log('🎨 Creating collections...');
    const collections = await Collection.create([
      {
        name: 'Velura',
        slug: 'velura',
        description: 'Step into softness with our signature collection',
        image: [
          '/hero-section/velure.png',
          '/hero-section/velure.png',
          '/hero-section/velure.png'
        ],
        category: categories[0]._id,
        isActive: true,
        isFeatured: true
      },
      {
        name: 'Jungle Weave',
        slug: 'jungle-weave',
        description: 'Nature-inspired textures for modern living',
        image: [
          '/hero-section/Jungle-carpet.png',
          '/hero-section/Jungle-carpet.png',
          '/hero-section/Jungle-carpet.png'
        ],
        category: categories[1]._id,
        isActive: true,
        isFeatured: true
      },
      {
        name: 'Medows',
        slug: 'medows',
        description: 'Subtle elegance in every thread',
        image: [
          '/hero-section/Medows-carpet.png',
          '/hero-section/Medows-carpet.png',
          '/hero-section/Medows-carpet.png'
        ],
        category: categories[0]._id,
        isActive: true,
        isFeatured: true
      },
      {
        name: 'Obscure',
        slug: 'obscure',
        description: 'Mystery and elegance combined',
        image: [
          '/hero-section/Morrocnmain.png',
          '/hero-section/Morrocnmain.png',
          '/hero-section/Morrocnmain.png'
        ],
        category: categories[2]._id,
        isActive: true,
        isFeatured: true
      },
      {
        name: 'EchoFade',
        slug: 'echofade',
        description: 'Raw beauty meets refined craftsmanship',
        image: [
          '/hero-section/Rugged-carpet.png',
          '/hero-section/Rugged-carpet.png',
          '/hero-section/Rugged-carpet.png'
        ],
        category: categories[1]._id,
        isActive: true,
        isFeatured: true
      },
      {
        name: 'Spaceship',
        slug: 'spaceship',
        description: 'Explore the cosmos of comfort',
        image: [
          '/hero-section/hero-2.png',
          '/hero-section/hero-2.png',
          '/hero-section/hero-2.png'
        ],
        category: categories[3]._id,
        isActive: true,
        isFeatured: true
      },
      {
        name: 'Persian Collection',
        slug: 'persian-collection',
        description: 'Authentic Persian-style design',
        image: [
          '/hero-section/Persian-main.png',
          '/hero-section/Persian-main.png',
          '/hero-section/Persian-main.png'
        ],
        category: categories[4]._id,
        isActive: true,
        isFeatured: true
      },
      {
        name: 'Indian Heritage',
        slug: 'indian-heritage',
        description: 'Traditional Indian carpet artistry',
        image: [
          '/hero-section/Indian-main.png',
          '/hero-section/Indian-main.png',
          '/hero-section/Indian-main.png'
        ],
        category: categories[5]._id,
        isActive: true,
        isFeatured: true
      },
      {
        name: 'Hero Collection',
        slug: 'hero-collection',
        description: 'Premium hero showcase collection',
        image: [
          '/hero-section/hero-1.png',
          '/hero-section/hero-1.png',
          '/hero-section/hero-1.png'
        ],
        category: categories[2]._id,
        isActive: true,
        isFeatured: true
      },
      {
        name: 'Moroccan Collection',
        slug: 'moroccan-collection',
        description: 'Traditional Moroccan patterns and textures',
        image: [
          '/hero-section/Morrocnmain.png',
          '/hero-section/Morrocnmain.png',
          '/hero-section/Morrocnmain.png'
        ],
        category: categories[2]._id,
        isActive: true,
        isFeatured: true
      }
    ]);
    console.log(`✅ Created ${collections.length} collections`);

    // Create Products
    console.log('🛍️ Creating products...');
    const products = await Product.create([
      {
        title: 'Velura Premium Carpet',
        slug: 'velura-premium',
        description: 'Ultra-soft velura carpet with contemporary design',
        category: categories[0]._id,
        collection: collections[0]._id,
        price: 45000,
        mrp: 65000,
        thumbnail: '/uploads/collection/1770116492656-velure.png',
        images: ['/uploads/collection/1770116492656-velure.png'],
        length: 8,
        width: 10,
        quantity: 5,
        isActive: true,
        sku: generateSKU()
      },
      {
        title: 'Jungle Weave Natural Fiber',
        slug: 'jungle-weave-natural',
        description: 'Nature-inspired design with natural fibers',
        category: categories[1]._id,
        collection: collections[1]._id,
        price: 35000,
        mrp: 50000,
        thumbnail: '/uploads/collection/1770116100172-Jungle-carpet.png',
        images: ['/uploads/collection/1770116100172-Jungle-carpet.png'],
        length: 6,
        width: 9,
        quantity: 8,
        isActive: true,
        sku: generateSKU()
      },
      {
        title: 'Medows Elegant Collection',
        slug: 'medows-elegant',
        description: 'Subtle and elegant carpet for any room',
        category: categories[0]._id,
        collection: collections[2]._id,
        price: 55000,
        mrp: 75000,
        thumbnail: '/uploads/collection/1770116197476-Medows-carpet.png',
        images: ['/uploads/collection/1770116197476-Medows-carpet.png'],
        length: 10,
        width: 12,
        quantity: 3,
        isActive: true,
        sku: generateSKU()
      },
      {
        title: 'Roxy Premium Rug',
        slug: 'roxy-premium',
        description: 'Dark and mysterious design premium rug',
        category: categories[2]._id,
        collection: collections[3]._id,
        price: 65000,
        mrp: 90000,
        thumbnail: '/uploads/collection/1770116275242-Roxy-carpet.png',
        images: ['/uploads/collection/1770116275242-Roxy-carpet.png'],
        length: 9,
        width: 11,
        quantity: 2,
        isActive: true,
        sku: generateSKU()
      },
      {
        title: 'Rugged Artistic Carpet',
        slug: 'rugged-artistic',
        description: 'Raw beauty meets refined craftsmanship',
        category: categories[1]._id,
        collection: collections[4]._id,
        price: 40000,
        mrp: 60000,
        thumbnail: '/uploads/collection/1770116338633-Rugged-carpet.png',
        images: ['/uploads/collection/1770116338633-Rugged-carpet.png'],
        length: 7,
        width: 10,
        quantity: 4,
        isActive: true,
        sku: generateSKU()
      },
      {
        title: 'Hero Modern Abstract',
        slug: 'hero-abstract',
        description: 'Futuristic design for contemporary homes',
        category: categories[3]._id,
        collection: collections[5]._id,
        price: 48000,
        mrp: 68000,
        thumbnail: '/uploads/collection/1770116427078-hero-1.png',
        images: ['/uploads/collection/1770116427078-hero-1.png'],
        length: 8,
        width: 10,
        quantity: 6,
        isActive: true,
        sku: generateSKU()
      },
      {
        title: 'Persian Heritage Rug',
        slug: 'persian-heritage',
        description: 'Authentic Persian-style carpet with elegance',
        category: categories[4]._id,
        collection: collections[6]._id,
        price: 52000,
        mrp: 72000,
        thumbnail: '/uploads/collection/1770116565202-Persian-main.png',
        images: ['/uploads/collection/1770116565202-Persian-main.png'],
        length: 9,
        width: 12,
        quantity: 3,
        isActive: true,
        sku: generateSKU()
      },
      {
        title: 'Indian Artistry Carpet',
        slug: 'indian-artistry',
        description: 'Traditional Indian carpet artistry design',
        category: categories[5]._id,
        collection: collections[7]._id,
        price: 58000,
        mrp: 80000,
        thumbnail: '/uploads/collection/1770116617764-Indian-main.png',
        images: ['/uploads/collection/1770116617764-Indian-main.png'],
        length: 10,
        width: 14,
        quantity: 2,
        isActive: true,
        sku: generateSKU()
      }
    ]);
    console.log(`✅ Created ${products.length} products`);

    console.log('');
    console.log('╔════════════════════════════════════════╗');
    console.log('║  DATABASE SEEDED SUCCESSFULLY! ✅     ║');
    console.log('╚════════════════════════════════════════╝');
    console.log('');
    console.log(`✅ ${categories.length} Categories created`);
    console.log(`✅ ${collections.length} Collections created`);
    console.log(`✅ ${products.length} Products created`);
    console.log('');
    console.log('All with proper image paths and relationships!');
    console.log('');

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error.message);
    process.exit(1);
  }
};

seedDatabase();
