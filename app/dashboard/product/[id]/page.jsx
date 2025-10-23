"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useTheme } from "next-themes";

export default function ProductDetails() {
    const { id } = useParams();
    const router = useRouter();
    const { theme } = useTheme();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const res = await fetch(`/api/products/${id}`);
                const data = await res.json();

                if (res.ok) setProduct(data);
                else setError(data.error || "Product not found");
            } catch (err) {
                setError("Server not reachable");
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                Loading product details...
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center text-red-500">
                {error}
            </div>
        );
    }

    return (
        <div
            className={`min-h-screen p-6 ${theme === "dark"
                    ? "bg-gray-900 text-gray-100"
                    : "bg-gray-100 text-gray-900"
                }`}
        >
            <div className="flex justify-between mb-6">
                <button
                    onClick={() => router.back()}
                    className="bg-gray-300 dark:bg-gray-700 text-black dark:text-white px-3 py-2 rounded hover:bg-gray-400 dark:hover:bg-gray-600 transition"
                >
                    ← Back
                </button>

                <button
                    onClick={() => router.push(`/dashboard/edit-product/${id}`)}
                    className="bg-yellow-400 text-white px-4 py-2 rounded hover:bg-yellow-500 transition"
                >
                    ✏️ Edit Product
                </button>
            </div>

            <div
                className={`max-w-2xl mx-auto p-6 rounded-2xl shadow ${theme === "dark" ? "bg-gray-800" : "bg-white"
                    }`}
            >
                <img
                    src={product.image || "/default.jpg"}
                    alt={product.title}
                    className="w-full h-64 object-cover rounded-xl mb-4"
                />
                <h1 className="text-3xl font-bold mb-2">{product.title}</h1>
                <p className="text-gray-600 dark:text-gray-400 mb-3">
                    {product.description}
                </p>

                <p className="text-lg font-semibold text-blue-500 mb-1">
                    Rs. {product.price}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                    Category: {product.category || "Uncategorized"}
                </p>
                <p
                    className={`text-sm font-medium ${product.inStock ? "text-green-500" : "text-red-500"
                        }`}
                >
                    {product.inStock ? "In Stock ✅" : "Out of Stock ❌"}
                </p>
            </div>
        </div>
    );
}
