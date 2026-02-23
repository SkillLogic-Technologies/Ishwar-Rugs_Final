import mongoose from "mongoose"

const contactSchema = new mongoose.Schema(
    {
        fullName : { type: String, required: true, trim: true },
        email : { type: String, required: true, trim: true, match: [/^\S+@\S+\.\S+$/, "Invalid email format"] },
        phone : { type: String, maxlength: 15, trim: true, match: [/^(\+91[\s\-]?)?\d{10}$/, "Invalid phone number format"] },
        inquiryType : { type: String, enum: ["general", "collection_inquiry", "custom_design"], default: "general" },
        subject : { type: String, required: true },
        message : { type: String, required: true },
        replyMessage: String,
        repliedAt: Date,
        status: { type: String, enum: ["new", "seen", "replied"], default: "new" },
    },
    { timestamps : true }
)

export default mongoose.model("Contact", contactSchema)