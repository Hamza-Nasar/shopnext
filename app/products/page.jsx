"use client";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useTheme } from "next-themes";

export default function ProductsPage() {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        setMounted(true);

        const fetchProducts = async () => {
            try {
                const res = await fetch("/api/products");
                const data = await res.json();

                if (res.ok) setProducts(data);
                else setError(data.error || "Failed to load products");
            } catch (err) {
                setError("Server not reachable");
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    if (!mounted)
        return (
            <div className="min-h-screen flex justify-center items-center text-gray-500">
                Loading...
            </div>
        );

    return (
        <div
            className={`min-h-screen p-6 transition-colors duration-300 ${theme === "dark"
                    ? "bg-gray-900 text-gray-100"
                    : "bg-gray-50 text-gray-900"
                }`}
        >
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold">🛍️ All Products</h1>

                <button
                    onClick={() => setTheme(theme === "light" ? "dark" : "light")}
                    className="bg-gray-300 dark:bg-gray-700 text-black dark:text-white px-3 py-2 rounded hover:bg-gray-400 dark:hover:bg-gray-600 transition"
                >
                    {theme === "light" ? "🌙 Dark" : "☀️ Light"}
                </button>
            </div>

            {loading ? (
                <p className="text-center text-gray-500">Loading products...</p>
            ) : error ? (
                <p className="text-center text-red-500">{error}</p>
            ) : products.length === 0 ? (
                <p className="text-center text-gray-500">No products found.</p>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {products.map((p) => (
                        <div
                            key={p._id}
                            className={`p-5 rounded-2xl shadow-md border transition hover:shadow-lg ${theme === "dark"
                                    ? "bg-gray-800 border-gray-700"
                                    : "bg-white border-gray-200"
                                }`}
                        >
                            <img
                                src={p.image || "/no-image.png"}
                                alt={p.title}
                                className="w-full h-48 object-cover rounded mb-3"
                            />
                            <h2 className="text-lg font-semibold mb-1">{p.title}</h2>
                            <p className="text-sm text-gray-500 mb-2">{p.category}</p>
                            <p className="font-bold mb-3">${p.price}</p>

                            <button
                                onClick={() => toast.success(`🛒 ${p.title} added to cart!`)}
                                className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
                            >
                                Add to Cart
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
