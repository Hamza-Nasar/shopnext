"use client";
import { useEffect, useState } from "react";
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

    // Fetch product data by ID
    useEffect(() => {
        async function fetchProduct() {
            try {
                const res = await fetch(`/api/product/${id}`);
                if (!res.ok) throw new Error("Failed to fetch product");
                const data = await res.json();
                setForm(data);
            } catch (err) {
                toast.error(err.message);
            }
        }

        if (id) fetchProduct();
    }, [id]);

    // Handle input change
    function handleChange(e) {
        const { name, value, type, checked } = e.target;
        setForm({
            ...form,
            [name]: type === "checkbox" ? checked : value,
        });
    }

    // Handle submit (PUT request)
    async function handleSubmit(e) {
        e.preventDefault();
        try {
            const res = await fetch(`/api/product/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });

            if (!res.ok) throw new Error("Failed to update product");
            toast.success("✅ Product updated successfully!");
            router.push("/dashboard");
        } catch (err) {
            toast.error(err.message);
        }
    }

    return (
        <div className="max-w-xl mx-auto p-4">
            <h2 className="text-2xl font-semibold mb-4 text-center">✏️ Edit Product</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <input
                    type="text"
                    name="title"
                    value={form.title}
                    onChange={handleChange}
                    placeholder="Title"
                    className="w-full border p-2 rounded"
                />
                <textarea
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    placeholder="Description"
                    className="w-full border p-2 rounded"
                />
                <input
                    type="number"
                    name="price"
                    value={form.price}
                    onChange={handleChange}
                    placeholder="Price"
                    className="w-full border p-2 rounded"
                />
                <input
                    type="text"
                    name="category"
                    value={form.category}
                    onChange={handleChange}
                    placeholder="Category"
                    className="w-full border p-2 rounded"
                />
                <input
                    type="text"
                    name="image"
                    value={form.image}
                    onChange={handleChange}
                    placeholder="Image URL"
                    className="w-full border p-2 rounded"
                />
                <label className="flex items-center gap-2">
                    <input
                        type="checkbox"
                        name="inStock"
                        checked={form.inStock}
                        onChange={handleChange}
                    />
                    In Stock
                </label>
                <button
                    type="submit"
                    className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
                >
                    Save Changes
                </button>
            </form>
        </div>
    );
}
