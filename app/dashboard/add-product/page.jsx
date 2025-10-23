"use client";
import { useState } from "react";
import toast from "react-hot-toast";
import { useTheme } from "next-themes";

export default function AddProduct() {
    const { theme, setTheme } = useTheme();

    const [form, setForm] = useState({
        title: "",
        description: "",
        price: "",
        category: "",
        image: "",
        inStock: true,
    });
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setForm({
            ...form,
            [name]: type === "checkbox" ? checked : value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage("");
        setLoading(true);

        const token = localStorage.getItem("token");
        if (!token) {
            setMessage("Please login first.");
            setLoading(false);
            return;
        }

        try {
            const res = await fetch("/api/products", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(form),
            });

            const data = await res.json();
            if (res.ok) {
                toast.success("✅ Product added successfully!");
                // router.push("/dashboard");
                setForm({
                    title: "",
                    description: "",
                    price: "",
                    category: "",
                    image: "",
                    inStock: true,
                });
            } else {
                setMessage(data.error || "❌ Failed to add product");
            }
        } catch (err) {
            setMessage("Server not reachable");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            className={`min-h-screen p-6 transition-colors duration-300 ${theme === "dark"
                    ? "bg-gray-900 text-gray-100"
                    : "bg-gradient-to-br from-gray-50 to-gray-200 text-gray-900"
                }`}
        >
            {/* Header */}
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold tracking-tight">
                    Add New Product 🛒
                </h1>

                <button
                    onClick={() => setTheme(theme === "light" ? "dark" : "light")}
                    className={`px-4 py-2 rounded-lg font-medium shadow transition-all duration-200 ${theme === "light"
                            ? "bg-gray-800 text-white hover:bg-black"
                            : "bg-gray-200 text-black hover:bg-white"
                        }`}
                >
                    {theme === "light" ? "🌙 Dark Mode" : "☀️ Light Mode"}
                </button>
            </div>

            {/* Message */}
            {message && (
                <p
                    className={`mb-4 text-center font-medium ${message.includes("✅") ? "text-green-500" : "text-red-500"
                        }`}
                >
                    {message}
                </p>
            )}

            {/* Form */}
            <form
                onSubmit={handleSubmit}
                className={`p-8 rounded-2xl shadow-xl w-full max-w-lg mx-auto transition-all duration-300 ${theme === "dark"
                        ? "bg-gray-800 text-gray-100"
                        : "bg-white text-gray-900 border border-gray-200"
                    }`}
            >
                <div className="space-y-4">
                    <input
                        name="title"
                        placeholder="Product Title"
                        value={form.title}
                        onChange={handleChange}
                        className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none ${theme === "dark"
                                ? "bg-gray-700 border-gray-600 text-white"
                                : "bg-gray-50 border-gray-300 text-black"
                            }`}
                        required
                    />

                    <textarea
                        name="description"
                        placeholder="Description"
                        value={form.description}
                        onChange={handleChange}
                        className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none ${theme === "dark"
                                ? "bg-gray-700 border-gray-600 text-white"
                                : "bg-gray-50 border-gray-300 text-black"
                            }`}
                        required
                    />

                    <input
                        type="number"
                        name="price"
                        placeholder="Price"
                        value={form.price}
                        onChange={handleChange}
                        className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none ${theme === "dark"
                                ? "bg-gray-700 border-gray-600 text-white"
                                : "bg-gray-50 border-gray-300 text-black"
                            }`}
                        required
                    />

                    <input
                        name="category"
                        placeholder="Category"
                        value={form.category}
                        onChange={handleChange}
                        className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none ${theme === "dark"
                                ? "bg-gray-700 border-gray-600 text-white"
                                : "bg-gray-50 border-gray-300 text-black"
                            }`}
                    />

                    <input
                        name="image"
                        placeholder="Image URL"
                        value={form.image}
                        onChange={handleChange}
                        className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none ${theme === "dark"
                                ? "bg-gray-700 border-gray-600 text-white"
                                : "bg-gray-50 border-gray-300 text-black"
                            }`}
                    />

                    <label className="flex items-center gap-2 mb-3">
                        <input
                            type="checkbox"
                            name="inStock"
                            checked={form.inStock}
                            onChange={handleChange}
                        />
                        <span>In Stock</span>
                    </label>
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className={`w-full mt-4 py-3 rounded-lg font-semibold text-white transition ${loading
                            ? "bg-blue-400"
                            : "bg-blue-600 hover:bg-blue-700 active:bg-blue-800"
                        }`}
                >
                    {loading ? "Adding..." : "Add Product"}
                </button>
            </form>
        </div>
    );
}
