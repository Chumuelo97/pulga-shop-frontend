"use client";

import { useState, useEffect } from 'react';



export default function EmbedCartPage() {
    const [cart, setCart] = useState([]);
    // const [isCartOpen, setIsCartOpen] = useState(false); // Ya no se usa
    // const [isLoading, setIsLoading] = useState(true); // Ya no se usa para UI
    // const [isModalOpen, setIsModalOpen] = useState(false); // Ya no se usa
    const [compradorId, setCompradorId] = useState(null);

    // Inicializar compradorId
    useEffect(() => {
        let storedId = localStorage.getItem('compradorId');
        if (!storedId) {
            storedId = crypto.randomUUID();
            localStorage.setItem('compradorId', storedId);
        }
        setCompradorId(storedId);
    }, []);

    // Cargar carrito
    const loadCartData = async () => {
        if (!compradorId) return;
        setIsLoading(true);
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
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadCartData();
    }, [compradorId]);

    // Escuchar mensajes del padre (la página externa)
    useEffect(() => {
        const handleMessage = (event) => {
            // En producción, deberíamos verificar event.origin por seguridad
            // if (event.origin !== "http://sitio-externo.com") return;

            const { type, product } = event.data;

            if (type === 'ADD_TO_CART') {
                addToCart(product);
                if (event.data.autoOpen !== false) {
                    openCart();
                }
            } else if (type === 'OPEN_CART') {
                openCart();
            }
        };

        window.addEventListener('message', handleMessage);
        return () => window.removeEventListener('message', handleMessage);
    }, [cart, compradorId]); // Dependencia cart y compradorId

    // Notificar al padre sobre cambios en el carrito (para el badge)
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
            background-color: #2ce053;
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
            background-color: #25bd47;
        }
        .cart-fab.hidden {
            opacity: 0;
            transform: scale(0);
            pointer-events: none;
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
            transform: scale(0);
            opacity: 0;
            transition: transform 0.2s ease, opacity 0.2s ease;
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
                styles: CART_STYLES
            }
        }, '*');
    }, []);

    const addToCart = async (product) => {
        if (!compradorId) return;
        try {
            await fetch('/api/cart', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    compradorId,
                    productoId: product.id,
                    cantidad: 1
                })
            });
            loadCartData();
        } catch (error) {
            console.error("Error al agregar al carrito:", error);
        }
    };

    const handleUpdateQuantity = async (index, action) => {
        const item = cart[index];
        if (!item || !compradorId) return;

        try {
            if (action === 'increase') {
                await fetch('/api/cart', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        compradorId,
                        productoId: item.id,
                        cantidad: 1
                    })
                });
            } else if (action === 'decrease') {
                await fetch(`/api/cart?compradorId=${compradorId}&productId=${item.id}&cantidad=1`, {
                    method: 'DELETE'
                });
            }
            loadCartData();
        } catch (error) {
            console.error("Error al actualizar cantidad:", error);
        }
    };

    const handleRemoveItem = async (index) => {
        const item = cart[index];
        if (!item || !compradorId) return;

        try {
            await fetch(`/api/cart?compradorId=${compradorId}&productId=${item.id}`, {
                method: 'DELETE'
            });
            loadCartData();
        } catch (error) {
            console.error("Error al eliminar producto:", error);
        }
    };

    const openCart = () => {
        // Redirigir al padre a la página del carrito
        window.parent.location.href = '/cart';
    };

    return (
        <>
            <style jsx global>{`
                body {
                    background-color: transparent !important;
                    overflow: hidden;
                }
            `}</style>

            {/* 
                El botón flotante y el badge se renderizan en el padre mediante los estilos inyectados 
                y la comunicación por mensajes. Este componente ahora actúa principalmente como 
                controlador lógico y de estado, sin renderizar UI visible propia en el iframe 
                (excepto si decidiéramos mover el botón aquí, pero por ahora se mantiene la lógica original).
                
                NOTA: Si el botón flotante fuera parte del iframe, lo renderizaríamos aquí.
                Pero según la arquitectura actual, el iframe es invisible y solo maneja lógica/mensajes,
                o el botón es inyectado.
                
                Revisando el código original, parece que el botón NO se renderiza aquí, 
                sino que se inyectan estilos para un botón que YA EXISTE o se crea en el padre?
                
                Espera, el `CartDrawer` era el que tenía la UI. Al quitarlo, el iframe queda vacío.
                El botón flotante en el padre (si existe) envía el mensaje 'OPEN_CART'.
                
                Si el botón flotante es parte de la "UI inyectada" o del "padre", 
                al hacer click en él, el padre envía 'OPEN_CART' al iframe.
                El iframe recibe el mensaje y ejecuta `openCart`.
            */}
        </>
    );
}
