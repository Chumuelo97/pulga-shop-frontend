"use client";

import { useState, useEffect } from 'react';
import CartDrawer from '../components/CartDrawer';

export default function Home() {
    
    const [cart, setCart] = useState([]);
    const [isCartOpen, setIsCartOpen] = useState(false);

    useEffect(() => {
        const loadCartData = async () => {
            try {
                const response = await fetch('/api/cart');
                const data = await response.json();
                setCart(data); 
            } catch (error) {
                console.error("Error al cargar los productos del carrito:", error);
            }
        };
        
        loadCartData();
    }, []);

    const openCart = () => setIsCartOpen(true);
    const closeCart = () => setIsCartOpen(false);

    const totalItemsInCart = cart.reduce((total, item) => {
        return total + item.quantity;
    }, 0); 

    return (
        <div>
            <div className="container">
                <h1>Mi Tienda</h1>
                <p>Haz clic en el carrito para ver tus productos.</p>
            </div>
            <button 
                id="cart-button" 
                className={`cart-button ${isCartOpen ? 'hidden' : ''}`}
                onClick={openCart}
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

            <CartDrawer
                isOpen={isCartOpen}
                onClose={closeCart}
                cart={cart}
                setCart={setCart}
            />
        </div>
    );
}