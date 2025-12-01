"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';


export default function EmbedCartPage() {
    const router = useRouter();
    const [cart, setCart] = useState([]);
    const [compradorId, setCompradorId] = useState(null);

    useEffect(() => {
        let storedId = localStorage.getItem('compradorId');
        if (!storedId) {
            storedId = crypto.randomUUID();
            localStorage.setItem('compradorId', storedId);
        }
        setCompradorId(storedId);
    }, []);

    const loadCartData = async () => {
        if (!compradorId) return;
        try {
            const response = await fetch(`/api/cart?id=${compradorId}`);
            if (response.ok) {
                const data = await response.json();
                const items = Array.isArray(data) ? data : (data.productos || []);
                setCart(items);
            }
        } catch (error) {
            console.error("Error al cargar el carrito:", error);
        } finally {
        }
    };

    useEffect(() => {
        loadCartData();
    }, [compradorId]);

    useEffect(() => {
        const handleMessage = (event) => {
            const { type } = event.data;
            if (type === 'OPEN_CART') {
                window.open('http://localhost:6969/cart', '_top');
            }
        };

        window.addEventListener('message', handleMessage);
        return () => window.removeEventListener('message', handleMessage);
    }, [cart, compradorId]);

    useEffect(() => {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        window.parent.postMessage({
            type: 'CART_UPDATED',
            totalItems: totalItems,
            cart: cart
        }, '*');
    }, [cart]);

    const CART_STYLES = `
        .cart-fab {
            position: fixed;
            overflow: visible;
            top: 20px;
            right: 20px;
            background-color: #23C55E;
            color: white;
            border: none;
            border-radius: 50%;
            width: 50px;
            height: 50px;
            font-size: 24px;
            cursor: pointer;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
            z-index: 1001;
            transition: transform 0.3s ease, opacity 0.3s ease;
        }
        .cart-fab:hover {
            transform: scale(1.1);
            background-color: #23C55E;
        }

        .cart-notification {
            position: absolute;
            top: -5px;
            right: -5px;
            background-color: #dc3545;
            color: white;
            font-size: 12px;
            font-weight: bold;
            width: 22px;
            height: 22px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .cart-notification.visible {
            transform: scale(1);
            opacity: 1;
        }
    `;

    // Enviar configuración de estilos al cargar
    useEffect(() => {
        window.parent.postMessage({
            type: 'CART_CONFIG',
            config: {
                styles: CART_STYLES,
                cartUrl: window.location.origin
            }
        }, '*');
    }, []);



    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

    return (
        <>
            <style jsx global>{`
                html, body {
                    background-color: transparent !important;
                    overflow: hidden;
                }
            `}</style>
        </>
    );
};