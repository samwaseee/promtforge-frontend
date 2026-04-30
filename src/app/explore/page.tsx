"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

// Define the shape of our Prompt data
interface Prompt {
    id: string;
    title: string;
    description: string;
    price: number;
    aiModel: string;
    category: string;
    seller: {
        name: string;
    };
}

export default function ExplorePage() {
    const router = useRouter();
    const [user, setUser] = useState<any>(null);
    const [prompts, setPrompts] = useState<Prompt[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // 1. Authenticate User
        const storedUser = localStorage.getItem("promptforge_user");
        if (!storedUser) {
            router.push("/");
            return;
        }
        setUser(JSON.parse(storedUser));

        // 2. Fetch Prompts from Backend
        const fetchPrompts = async () => {
            try {
                const res = await fetch("http://localhost:5000/api/prompts");
                if (res.ok) {
                    const data = await res.json();
                    setPrompts(data);
                }
            } catch (error) {
                console.error("Failed to fetch prompts:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchPrompts();
    }, [router]);

    if (!user || isLoading) {
        return (
            <div className="min-h-screen bg-gray-950 text-white flex justify-center items-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-950 text-white p-8">
            <div className="max-w-7xl mx-auto">
                {/* HEADER */}
                <header className="flex justify-between items-center border-b border-gray-800 pb-6 mb-8">
                    <div>
                        <h1 className="text-3xl font-bold">Explore Prompts</h1>
                        <p className="text-gray-400 mt-1">Discover premium AI engineered prompts.</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => router.push("/create")}
                            className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg font-medium transition-colors mr-4"
                        >
                            + Sell Prompt
                        </button>
                        <span className="text-gray-300 hidden md:block">Welcome, {user.name}</span>
                        {user.avatar ? (
                            <img
                                src={user.avatar}
                                alt="Profile"
                                referrerPolicy="no-referrer"
                                className="w-10 h-10 rounded-full border border-gray-700 object-cover"
                            />
                        ) : (
                            <div className="w-10 h-10 rounded-full bg-gray-800 border border-gray-700 flex items-center justify-center">
                                {user.name.charAt(0)}
                            </div>
                        )}
                        <button
                            onClick={() => {
                                localStorage.clear();
                                router.push("/");
                            }}
                            className="text-sm text-red-400 hover:text-red-300 ml-2"
                        >
                            Logout
                        </button>
                    </div>
                </header>

                {/* PROMPT GRID */}
                {prompts.length === 0 ? (
                    <div className="text-center py-20 bg-gray-900 rounded-xl border border-gray-800">
                        <p className="text-gray-400 text-lg">No prompts found. Be the first to sell one!</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {prompts.map((prompt) => (
                            <div
                                key={prompt.id}
                                className="bg-gray-900 border border-gray-800 rounded-xl p-5 hover:border-blue-500 transition-all cursor-pointer group flex flex-col justify-between h-full"
                            >
                                <div>
                                    <div className="flex justify-between items-start mb-3">
                                        <span className="text-xs font-semibold px-2 py-1 bg-blue-900/50 text-blue-400 rounded-md">
                                            {prompt.category}
                                        </span>
                                        <span className="text-xs font-semibold px-2 py-1 bg-gray-800 text-gray-300 rounded-md">
                                            {prompt.aiModel}
                                        </span>
                                    </div>
                                    <h3 className="text-xl font-bold mb-2 group-hover:text-blue-400 transition-colors">
                                        {prompt.title}
                                    </h3>
                                    <p className="text-gray-400 text-sm line-clamp-3 mb-4">
                                        {prompt.description}
                                    </p>
                                </div>

                                <div className="flex justify-between items-end pt-4 border-t border-gray-800 mt-auto">
                                    <div className="text-sm text-gray-500">
                                        By <span className="text-gray-300">{prompt.seller.name}</span>
                                    </div>
                                    <div className="text-lg font-bold text-green-400">
                                        ${prompt.price.toFixed(2)}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}