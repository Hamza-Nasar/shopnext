"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import toast from "react-hot-toast";

export default function ViewProduct() {
    const { id } = useParams();
    const router = useRouter();
    const { theme } = useTheme();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [mounted, setMounted] = useState(false);

    useEffect(() => setMounted(true), []);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const token = localStorage.getItem("token");
                const res = await fetch(`/api/products/${id}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const data = await res.json();
                if (res.ok) {
                    setProduct(data);
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

    const handleDelete = async () => {
        const confirmDelete = confirm("Are you sure you want to delete this product?");
        if (!confirmDelete) return;

        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`/api/products/${id}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await res.json();

            if (res.ok) {
                toast.success("🗑️ Product deleted successfully!");
                router.push("/dashboard");
            } else {
                toast.error(data.error || "Delete failed");
            }
        } catch {
            toast.error("Server not reachable");
        }
    };

    if (!mounted) return null;
    if (loading) return <p className="text-center mt-10">Loading...</p>;
    if (!product) return <p className="text-center mt-10">Product not found</p>;

    return (
        <div
            className={`min-h-screen flex flex-col items-center justify-center p-6 ${theme === "dark" ? "bg-gray-900 text-white" : "bg-gray-100 text-black"
                }`}
        >
            <div
                className={`max-w-md w-full p-6 rounded-2xl shadow-lg ${theme === "dark" ? "bg-gray-800" : "bg-white"
                    }`}
            >
                <img
                    src={product.image}
                    alt={product.title}
                    className="w-full h-56 object-cover rounded-lg mb-4"
                />
                <h1 className="text-2xl font-bold mb-2">{product.title}</h1>
                <p className="text-gray-400 mb-2">{product.category}</p>
                <p className="mb-3">{product.description}</p>
                <p className="font-semibold mb-4">💰 Price: ${product.price}</p>

                <div className="flex justify-between">
                    <button
                        onClick={() => router.push(`/dashboard/product/${id}/edit`)}
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    >
                        Edit
                    </button>
                    <button
                        onClick={handleDelete}
                        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                    >
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
}
v