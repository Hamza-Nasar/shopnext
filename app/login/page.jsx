"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function Login() {
    const router = useRouter();
    const [form, setForm] = useState({ email: "", password: "" });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!form.email || !form.password) {
            toast.error("Please fill in all fields");
            return;
        }

        setLoading(true);

        try {
            const res = await fetch("/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });

            const data = await res.json();

            if (!res.ok) {
                toast.error(data.message || "Invalid credentials");
            } else {
                localStorage.setItem("token", data.token);
                toast.success("Login successful!");
                router.push("/dashboard");
            }
        } catch (error) {
            console.error("Login error:", error);
            toast.error("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-gray-100 to-gray-200">
            <form
                onSubmit={handleSubmit}
                className="bg-white p-8 rounded-2xl shadow-lg w-80 transition-all hover:shadow-xl"
            >
                <h2 className="text-2xl font-bold mb-5 text-center text-gray-800">
                    Login
                </h2>

                <div className="space-y-3">
                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={form.email}
                        onChange={handleChange}
                        className="w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-green-400 focus:outline-none"
                    />

                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={form.password}
                        onChange={handleChange}
                        className="w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-green-400 focus:outline-none"
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className={`mt-5 bg-green-500 text-white w-full py-2 rounded-md font-semibold hover:bg-green-600 transition-all ${loading ? "opacity-70 cursor-not-allowed" : ""
                        }`}
                >
                    {loading ? "Logging in..." : "Login"}
                </button>

                <p className="text-center text-sm text-gray-500 mt-3">
                    Don’t have an account?{" "}
                    <a href="/register" className="text-green-600 hover:underline">
                        Register
                    </a>
                </p>
            </form>
        </div>
    );
}
