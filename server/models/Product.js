import mongoose from "mongoose"
import slugify from "slugify";

const productSchema = new mongoose.Schema(
    {
        title : { type: String, required: true, trim: true},
        slug : { type: String, unique: true, trim: true },
        description: { type: String },
        category: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true },
        collection: { type: mongoose.Schema.Types.ObjectId, ref: "Collection", default: null },
        price: { type: Number },
        mrp: { type: Number, required: true },
        discountPercent: { type: Number, default: 0 },
        sku: { type: String, unique: true, required: true, immutable: true },
        stock: { type: Number, default: 0 },

        material: { type: String },   
        weaveType: { type: String }, 
        pattern: { type: String },  
        style: { type: String },    
        pileHeight: { type: String }, 

        length: { type: Number },     // in ft
        width: { type: Number },      // in ft
        weight: { type: Number },     // in kg
        shape: { type: String }, 

        color: { type: String },
        secondaryColor: { type: String },

        originCountry: { type: String },
        manufacturer: { type: String, default: "Ishwar Rugs" },

        careInstructions: { type: String },
        thumbnail: { type: String },
        images: [{ type: String }],

        tags: [{ type: String }],
        isFeatured: { type: Boolean, default: false },

        rating: { type: Number, default: 0 },
        reviews: [
        {
            user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: false },
            guestId: String,
            comment: String,
            rating: Number,
            date: { type: Date, default: Date.now }
        }
        ]
    },
    { timestamps: true }
);

productSchema.pre("validate", async function () {  //Document
  if (!this.isModified("title")) return ;

  let baseSlug = slugify(this.title, { lower: true, strict: true });
  let slug = baseSlug;
  let counter = 1;

  while (await this.constructor.findOne({ slug })) {
    slug = `${baseSlug}-${counter++}`;
  }

  this.slug = slug;

  if (this.mrp && this.discountPercent >= 0) {
    const discountAmount = (this.mrp * this.discountPercent) / 100;
    this.price = Math.round(this.mrp - discountAmount);
  }

  if (!this.sku) {
    this.sku = "RUG-" + Date.now().toString(36).toUpperCase();
  }
});

productSchema.pre("findOneAndUpdate", async function () { // Query
  const update = this.getUpdate()
  const mrp = update.mrp;
  const discount = update.discountPercent;

  if (mrp !== undefined && discount !== undefined) {
    const discountAmount = (mrp * discount) / 100;
    update.price = Math.round(mrp - discountAmount);
  }

  if (!update.title) return;
  const baseSlug = slugify(update.title, { lower: true, strict: true });
  let slug = baseSlug
  let counter = 1
  const model = this.model;

  while (await model.findOne({ slug })) {
    slug = `${baseSlug}-${counter++}`;
  }
  update.slug = slug;
});

export default mongoose.model("Product", productSchema);