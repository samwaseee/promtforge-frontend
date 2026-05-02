"use client";

import { createContext, useContext, useState, useEffect } from "react";

// Define what a cart item looks like
export interface CartItem {
    id: string;
    title: string;
    price: number;
    category: string;
    imageUrl?: string;
}

const CartContext = createContext<any>(null);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [isInitialized, setIsInitialized] = useState(false);

    // 1. Load cart from local storage when the app starts
    useEffect(() => {
        const savedCart = localStorage.getItem("promptforge_cart");
        if (savedCart) {
            setCartItems(JSON.parse(savedCart));
        }
        setIsInitialized(true);
    }, []);

    // Inside CartProvider
    useEffect(() => {
        // Only load if we aren't coming from a successful payment page
        // (This prevents the cart from re-appearing after a wipe)
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.get("success") !== "true") {
            const savedCart = localStorage.getItem("promptforge_cart");
            if (savedCart) {
                setCartItems(JSON.parse(savedCart));
            }
        }
        setIsInitialized(true);
    }, []);

    // 2. Save to local storage whenever the cart changes
    useEffect(() => {
        if (isInitialized) {
            localStorage.setItem("promptforge_cart", JSON.stringify(cartItems));
        }
    }, [cartItems, isInitialized]);

    // Actions
    const addToCart = (item: CartItem) => {
        setCartItems((prev) => {
            // Prevent adding duplicates
            if (prev.find((i) => i.id === item.id)) return prev;
            return [...prev, item];
        });
    };

    const removeFromCart = (id: string) => {
        setCartItems((prev) => prev.filter((item) => item.id !== id));
    };

    const clearCart = () => {
        // 1. Clear the state
        setCartItems([]);

        // 2. Forcefully remove from localStorage immediately
        localStorage.removeItem("promptforge_cart");
        console.log("Cart cleared from state and storage.");
    };

    const cartTotal = cartItems.reduce((sum, item) => sum + item.price, 0);

    return (
        <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, clearCart, cartTotal }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => useContext(CartContext);