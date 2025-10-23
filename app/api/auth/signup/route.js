import { NextResponse } from "next/server";
import { connectDB } from "@/lib/dbConnect";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export async function POST(req) {
    try {
        await connectDB();
        const { name, email, password } = await req.json();

        if (!name || !email || !password) {
            return NextResponse.json({ error: "All fields required" }, { status: 400 });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return NextResponse.json({ error: "User already exists" }, { status: 400 });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await User.create({ name, email, password: hashedPassword });

        return NextResponse.json(
            { message: "User registered successfully ✅", user: newUser },
            { status: 201 }
        );
    } catch (err) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
