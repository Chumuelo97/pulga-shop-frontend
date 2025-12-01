// app/page.js
"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
    const router = useRouter();
    const [cart, setCart] = useState([]);
    const [compradorId, setCompradorId] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        let storedId = localStorage.getItem('compradorId');
        if (!storedId) {
            storedId = crypto.randomUUID();
            localStorage.setItem('compradorId', storedId);
        }
        setCompradorId(storedId);
    }, []);

    useEffect(() => {
        if (!compradorId) return;
        const loadCartData = async () => {
            setIsLoading(true);
            try {
                const response = await fetch(`/api/cart?id=${compradorId}`);
                if (response.ok) {
                    const data = await response.json();
                    const items = Array.isArray(data) ? data : (data.productos || []);
                    setCart(items);
                } else {
                    console.error("Error al cargar el carrito:", await response.text());
                    setCart([]);
                }
            } catch (error) {
                console.error("Error al cargar los productos del carrito:", error);
                setCart([]);
            } finally {
                setIsLoading(false);
            }
        };
        loadCartData();
    }, [compradorId]);

    const handleCartClick = () => {
        router.push('/cart');

    };

    const totalItemsInCart = cart.reduce((total, item) => {
        return total + item.quantity;
    }, 0);

    return (
        <div>
            <button
                id="cart-button"
                className="cart-button"
                onClick={handleCartClick}
            >
                🛒
                {totalItemsInCart > 0 && (
                    <span
                        className={`cart-notification ${totalItemsInCart > 0 ? 'visible' : ''}`}
                    >
                        {totalItemsInCart}
                    </span>
                )}
            </button>
        </div>
    );
}
