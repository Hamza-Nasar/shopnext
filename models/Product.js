import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
    {
        title: { type: String, required: true },
        description: { type: String },
        price: { type: Number, required: true },
        category: { type: String },
        image: { type: String },
        inStock: { type: Boolean, default: true },
    },
    { timestamps: true }
);

export default mongoose.models.Product || mongoose.model("Product", productSchema);
