"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function Signup() {
    const router = useRouter();
    const [form, setForm] = useState({ name: "", email: "", password: "" });
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        const res = await fetch("/api/auth/signup", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(form),
        });

        const data = await res.json();
        if (res.ok) {
            toast.success("Signup successful!");
            router.push("/login");
        } else {
            toast.error(data.message || "Something went wrong");
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <form
                onSubmit={handleSubmit}
                className="bg-white p-6 rounded-2xl shadow-md w-80"
            >
                <h2 className="text-2xl font-bold mb-4 text-center">Signup</h2>
                {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
                <input
                    type="text"
                    placeholder="Name"
                    className="w-full border p-2 mb-3 rounded"
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
                <input
                    type="email"
                    placeholder="Email"
                    className="w-full border p-2 mb-3 rounded"
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
                <input
                    type="password"
                    placeholder="Password"
                    className="w-full border p-2 mb-3 rounded"
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                />
                <button
                    type="submit"
                    className="bg-blue-500 text-white w-full py-2 rounded hover:bg-blue-600"
                >
                    Signup
                </button>
            </form>
        </div>
    );
}
