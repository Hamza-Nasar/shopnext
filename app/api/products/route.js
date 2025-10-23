import { NextResponse } from "next/server";
import { connectDB } from "@/lib/dbConnect";
import Product from "@/models/Product";

// ✅ GET all products
export async function GET() {
    try {
        await connectDB();
        const products = await Product.find({}).sort({ createdAt: -1 }); // latest first
        return NextResponse.json(products, { status: 200 });
    } catch (error) {
        console.error("GET /api/products error:", error);
        return NextResponse.json(
            { success: false, message: "Failed to fetch products." },
            { status: 500 }
        );
    }
}

// ✅ POST new product
export async function POST(req) {
    try {
        await connectDB();
        const body = await req.json();

        // 🧠 Basic validation
        if (!body.name || !body.price || !body.category) {
            return NextResponse.json(
                { success: false, message: "Please fill all required fields." },
                { status: 400 }
            );
        }

        const newProduct = await Product.create(body);
        return NextResponse.json(
            { success: true, product: newProduct },
            { status: 201 }
        );
    } catch (error) {
        console.error("POST /api/products error:", error);
        return NextResponse.json(
            { success: false, message: error.message },
            { status: 500 }
        );
    }
}
