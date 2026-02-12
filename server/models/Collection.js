import mongoose from "mongoose";
import slugify from "slugify";

const collectionSchema = new mongoose.Schema(
    {
        name: { type: String, required: true, unique: true, trim: true },
        slug: { type: String, unique: true, trim: true },
        description: { type: String },
        image: { type: String }, 
        isActive: { type: Boolean, default: true }
    },
    { 
        timestamps: true
    }
);

collectionSchema.pre("validate", async function () { //Documnet
    
    if (!this.isModified("name")){
        return;
    } 

    let baseSlug = slugify(this.name, { lower: true, strict: true });
    let slug = baseSlug;
    let counter = 1;

    while ( await this.constructor.findOne({ slug })) {
        slug = `${baseSlug}-${counter++}`;
    }
    this.slug = slug;
})

collectionSchema.pre("findOneAndUpdate", async function () { // Query
  const update = this.getUpdate()
  if (!update.name) return;

  const baseSlug = slugify(update.name, { lower: true, strict: true });
  let slug = baseSlug
  let counter = 1
  const model = this.model;

  while (await model.findOne({ slug })) {
    slug = `${baseSlug}-${counter++}`;
  }

  update.slug = slug;
});


export default mongoose.model("Collection", collectionSchema);

// Document has constructor means Category model but query have filters, updated field, not actual document field