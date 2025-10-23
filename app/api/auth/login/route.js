import { NextResponse } from "next/server";
import { connectDB } from "@/lib/dbConnect";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export async function POST(req) {
    try {
        await connectDB();
        const { email, password } = await req.json();

        const user = await User.findOne({ email });
        if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });

        const token = jwt.sign(
            { id: user._id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        return NextResponse.json({
            message: "Login successful ✅",
            token,
            user: { id: user._id, name: user.name, email: user.email },
        });
    } catch (err) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
