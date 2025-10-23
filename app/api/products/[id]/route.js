import { NextResponse } from "next/server";
import { connectDB } from "@/lib/dbConnect";
import Product from "@/models/Product";
import mongoose from "mongoose";

// ✅ GET single product
export async function GET(req, { params }) {
    try {
        await connectDB();

        // Validate ID format
        if (!mongoose.Types.ObjectId.isValid(params.id)) {
            return NextResponse.json(
                { success: false, message: "Invalid Product ID ❌" },
                { status: 400 }
            );
        }

        const product = await Product.findById(params.id);
        if (!product) {
            return NextResponse.json(
                { success: false, message: "Product not found ❌" },
                { status: 404 }
            );
        }

        console.log("Loaded Product:", product);

        return NextResponse.json({ success: true, product }, { status: 200 });
    } catch (error) {
        console.error("GET /api/products/[id] error:", error);
        return NextResponse.json(
            { success: false, message: error.message },
            { status: 500 }
        );
    }
}

// ✅ PUT update product
export async function PUT(req, { params }) {
    try {
        await connectDB();

        if (!mongoose.Types.ObjectId.isValid(params.id)) {
            return NextResponse.json(
                { success: false, message: "Invalid Product ID ❌" },
                { status: 400 }
            );
        }

        const body = await req.json();

        const updatedProduct = await Product.findByIdAndUpdate(
            params.id,
            body,
            { new: true, runValidators: true }
        );

        if (!updatedProduct) {
            return NextResponse.json(
                { success: false, message: "Product not found ❌" },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            message: "Product updated successfully ✅",
            product: updatedProduct,
        });
    } catch (error) {
        console.error("PUT /api/products/[id] error:", error);
        return NextResponse.json(
            { success: false, message: error.message },
            { status: 400 }
        );
    }
}

// ✅ DELETE product
export async function DELETE(req, { params }) {
    try {
        await connectDB();

        if (!mongoose.Types.ObjectId.isValid(params.id)) {
            return NextResponse.json(
                { success: false, message: "Invalid Product ID ❌" },
                { status: 400 }
            );
        }

        const deleted = await Product.findByIdAndDelete(params.id);

        if (!deleted) {
            return NextResponse.json(
                { success: false, message: "Product not found ❌" },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            message: "Product deleted successfully 🗑️",
        });
    } catch (error) {
        console.error("DELETE /api/products/[id] error:", error);
        return NextResponse.json(
            { success: false, message: error.message },
            { status: 500 }
        );
    }
}
