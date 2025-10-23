"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function EditProduct() {
    const { id } = useParams();
    const router = useRouter();
    const [form, setForm] = useState({
        title: "",
        description: "",
        price: "",
        category: "",
        image: "",
        inStock: true,
    });
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            router.push("/login");
            return;
        }

        const fetchProduct = async () => {
            try {
                const res = await fetch(`/api/products/${id}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const data = await res.json();

                if (res.ok && data.product) {
                    setForm({
                        title: data.product.title || "",
                        description: data.product.description || "",
                        price: data.product.price || "",
                        category: data.product.category || "",
                        image: data.product.image || "",
                        inStock: data.product.inStock ?? true,
                    });
                } else {
                    setMessage(data.message || "Failed to load product ❌");
                }
            } catch (err) {
                setMessage("Server not reachable");
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [id, router]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage("");

        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`/api/products/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(form),
            });

            const data = await res.json();
            if (res.ok && data.success) {
                toast.success("✅ Product updated successfully!");
                setTimeout(() => router.push("/dashboard"), 1000);
            } else {
                toast.error(data.message || "❌ Failed to update product");
            }
        } catch (err) {
            toast.error("Server not reachable");
        }
    };

    if (loading) return <p className="p-6 text-gray-500">Loading product...</p>;

    return (
        <div className="min-h-screen bg-gray-100 p-6">
            <h1 className="text-3xl font-bold mb-6">Edit Product 📝</h1>

            {message && <p className="mb-4 text-blue-500">{message}</p>}

            <form
                onSubmit={handleSubmit}
                className="bg-white p-6 rounded-2xl shadow-md w-full max-w-lg"
            >
                <input
                    name="title"
                    placeholder="Product Title"
                    value={form.title ?? ""}
                    onChange={handleChange}
                    className="w-full border p-2 mb-3 rounded"
                    required
                />
                <textarea
                    name="description"
                    placeholder="Description"
                    value={form.description ?? ""}
                    onChange={handleChange}
                    className="w-full border p-2 mb-3 rounded"
                    required
                />
                <input
                    type="number"
                    name="price"
                    placeholder="Price"
                    value={form.price ?? ""}
                    onChange={handleChange}
                    className="w-full border p-2 mb-3 rounded"
                    required
                />
                <input
                    name="category"
                    placeholder="Category"
                    value={form.category ?? ""}
                    onChange={handleChange}
                    className="w-full border p-2 mb-3 rounded"
                />
                <input
                    name="image"
                    placeholder="Image URL"
                    value={form.image ?? ""}
                    onChange={handleChange}
                    className="w-full border p-2 mb-3 rounded"
                />
                <label className="flex items-center gap-2 mb-3">
                    <input
                        type="checkbox"
                        name="inStock"
                        checked={!!form.inStock}
                        onChange={handleChange}
                    />
                    In Stock
                </label>

                <button
                    type="submit"
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                    Update Product
                </button>
            </form>
        </div>
    );
}
