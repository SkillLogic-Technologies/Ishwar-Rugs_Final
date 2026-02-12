import mongoose from "mongoose"

const cartSchema = new mongoose.Schema(
    {
        user : { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null},
        guestId: { type: String, default: null },
        items : [{
            product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
            quantity: { type: Number, default:1, min:1},
            price: { type: Number, required: true },
            total: { type: Number, required: true }
        }],
        cartTotal: { type: Number, default: 0 }
    },
    { timestamps: true }
)

export default mongoose.model("Cart", cartSchema)