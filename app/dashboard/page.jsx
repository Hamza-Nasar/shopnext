"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import { useTheme } from "next-themes";

export default function Dashboard() {
    const [products, setProducts] = useState([]);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    // Prevent hydration mismatch
    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (!mounted) return;

        const fetchProducts = async () => {
            const token = localStorage.getItem("token");
            if (!token) {
                window.location.href = "/login";
                return;
            }

            try {
                const res = await fetch("/api/products", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                const data = await res.json();
                if (res.ok) {
                    setProducts(data);
                } else {
                    setError(data.error || "Failed to load products");
                }
            } catch (err) {
                setError("Server not reachable");
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [mounted]);

    const handleLogout = () => {
        document.cookie =
            "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
        window.location.href = "/login";
    };

    const handleEdit = (id) => {
        window.location.href = `/dashboard/edit-product/${id}`;
    };



    const handleDelete = async (id) => {
        const confirmDelete = window.confirm(
            "Are you sure you want to delete this product?"
        );
        if (!confirmDelete) return;

        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`/api/products/${id}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const data = await res.json();
            if (res.ok) {
                toast.success("✅ Product deleted successfully!");
                setProducts(products.filter((p) => p._id !== id));
            } else {
                toast.error(`❌ ${data.error}`);
            }
        } catch (err) {
            toast.error("Server not reachable");
        }
    };

    // 🧠 Wait until mounted to render theme-based UI
    if (!mounted) {
        return (
            <div className="min-h-screen flex items-center justify-center text-gray-500">
                Loading dashboard...
            </div>
        );
    }

    return (
        <div
            className={`min-h-screen p-6 transition-colors duration-300 ${theme === "dark"
                ? "bg-gray-900 text-gray-100"
                : "bg-gray-100 text-gray-900"
                }`}
        >
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-3xl font-bold">Dashboard 🧭</h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        Current theme: {theme}
                    </p>
                </div>

                <div className="flex gap-3">
                    <button
                        onClick={() =>
                            setTheme(theme === "light" ? "dark" : "light")
                        }
                        className="bg-gray-300 dark:bg-gray-700 text-black dark:text-white px-3 py-2 rounded hover:bg-gray-400 dark:hover:bg-gray-600 transition"
                    >
                        {theme === "light" ? "🌙 Dark" : "☀️ Light"}
                    </button>

                    <Link
                        href="/dashboard/add-product"
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
                    >
                        + Add Product
                    </Link>
                    <button
                        onClick={handleLogout}
                        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
                    >
                        Logout
                    </button>
                </div>
            </div>

            {/* Loading / Error / Products */}
            {loading ? (
                <p className="text-center text-gray-500">
                    Loading products...
                </p>
            ) : error ? (
                <p className="text-center text-red-500">{error}</p>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {products.length > 0 ? (
                        products.map((p) => (
                            <div
                                key={p._id}
                                className={`p-4 rounded-2xl shadow hover:shadow-lg transition ${theme === "dark"
                                    ? "bg-gray-800 text-gray-100"
                                    : "bg-white text-gray-900"
                                    }`}
                            >
                                <img
                                    src={p.image || "/default.jpg"}
                                    onError={(e) =>
                                        (e.target.src = "/default.jpg")
                                    }
                                    alt={p.title}
                                    className="w-full h-40 object-cover rounded-xl mb-2"
                                />
                                <h2 className="font-semibold text-lg">
                                    {p.title}
                                </h2>
                                <p className="text-gray-600 dark:text-gray-400 mb-2">
                                    {p.category}
                                </p>
                                <p className="text-blue-500 font-bold">
                                    Rs. {p.price}
                                </p>

                                <div className="flex justify-between mt-3">
                                    <button
                                        onClick={() => handleEdit(p._id)}
                                        className="bg-yellow-400 text-white px-3 py-1 rounded hover:bg-yellow-500 transition"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDelete(p._id)}
                                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
                                    >
                                        Delete
                                    </button>
                                    <Link href={`/dashboard/product/${p._id}`}>
                                        <button className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 transition">
                                            View
                                        </button>
                                    </Link>

                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-center text-gray-600 dark:text-gray-400">
                            No products found.
                        </p>
                    )}
                </div>
            )}
        </div>
    );
}
