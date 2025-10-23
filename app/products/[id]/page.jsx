"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import toast from "react-hot-toast";

export default function EditProduct() {
    const { id } = useParams();
    const router = useRouter();
    const { theme } = useTheme();

    const [form, setForm] = useState({
        title: "",
        description: "",
        price: "",
        category: "",
        image: "",
    });

    const [loading, setLoading] = useState(true);
    const [mounted, setMounted] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);

    useEffect(() => setMounted(true), []);

    // Fetch product if editing
    useEffect(() => {
        if (!id) {
            setLoading(false);
            return;
        }

        const fetchProduct = async () => {
            try {
                const token = localStorage.getItem("token");
                if (!token) {
                    router.push("/login");
                    return;
                }

                const res = await fetch(`/api/products/${id}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const data = await res.json();

                if (res.ok) {
                    setForm({
                        title: data.title || "",
                        description: data.description || "",
                        price: data.price || "",
                        category: data.category || "",
                        image: data.image || "",
                    });
                    setIsEditMode(true);
                } else {
                    toast.error(data.error || "Failed to fetch product");
                }
            } catch {
                toast.error("Server not reachable");
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [id]);

    // Handle create or update
    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem("token");

        if (!form.title || !form.price) {
            toast.error("Title and Price are required!");
            return;
        }

        try {
            const method = isEditMode ? "PUT" : "POST";
            const url = isEditMode
                ? `/api/products/${id}`
                : "/api/products";

            const res = await fetch(url, {
                method,
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(form),
            });

            const data = await res.json();

            if (res.ok) {
                toast.success(
                    isEditMode
                        ? "✅ Product updated successfully!"
                        : "✅ Product added successfully!"
                );
                router.push("/dashboard");
            } else {
                toast.error(data.error || "Operation failed");
            }
        } catch {
            toast.error("Server not reachable");
        }
    };

    if (!mounted) return null;
    if (loading) return <p className="text-center mt-10">Loading...</p>;

    return (
        <div
            className={`min-h-screen flex items-center justify-center p-6 transition-colors duration-300 ${theme === "dark"
                    ? "bg-gray-900 text-white"
                    : "bg-gray-100 text-black"
                }`}
        >
            <form
                onSubmit={handleSubmit}
                className={`max-w-md w-full p-6 rounded-2xl shadow-lg ${theme === "dark" ? "bg-gray-800" : "bg-white"
                    }`}
            >
                <h1 className="text-2xl font-bold mb-4">
                    {isEditMode ? "Edit Product 🛠️" : "Add New Product ➕"}
                </h1>

                <input
                    type="text"
                    placeholder="Title"
                    value={form.title}
                    onChange={(e) =>
                        setForm({ ...form, title: e.target.value })
                    }
                    className="w-full p-2 mb-3 border rounded"
                />
                <input
                    type="text"
                    placeholder="Category"
                    value={form.category}
                    onChange={(e) =>
                        setForm({ ...form, category: e.target.value })
                    }
                    className="w-full p-2 mb-3 border rounded"
                />
                <textarea
                    placeholder="Description"
                    value={form.description}
                    onChange={(e) =>
                        setForm({ ...form, description: e.target.value })
                    }
                    className="w-full p-2 mb-3 border rounded"
                />
                <input
                    type="number"
                    placeholder="Price"
                    value={form.price}
                    onChange={(e) =>
                        setForm({ ...form, price: e.target.value })
                    }
                    className="w-full p-2 mb-3 border rounded"
                />
                <input
                    type="text"
                    placeholder="Image URL"
                    value={form.image}
                    onChange={(e) =>
                        setForm({ ...form, image: e.target.value })
                    }
                    className="w-full p-2 mb-4 border rounded"
                />

                <div className="flex justify-between">
                    <button
                        type="submit"
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    >
                        {isEditMode ? "Update" : "Add Product"}
                    </button>
                    <button
                        type="button"
                        onClick={() => router.back()}
                        className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
}
