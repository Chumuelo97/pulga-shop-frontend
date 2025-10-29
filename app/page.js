// app/page.js
"use client";

// ¡CAMBIO! Importamos useEffect
import { useState, useEffect } from 'react';
import CartDrawer from '../components/CartDrawer';
// --- ¡NUEVO! ---
import ConfirmationModal from '../components/ConfirmationModal';

export default function Home() {
    
    const [cart, setCart] = useState([]);
    const [isCartOpen, setIsCartOpen] = useState(false);
    
    // --- ¡NUEVO! Estado para la Heurística 1 (Visibilidad) ---
    const [isLoading, setIsLoading] = useState(true); // Empezamos en 'cargando'
    
    // --- ¡NUEVO! Estado para la Heurística 2 (Prevención) ---
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        const loadCartData = async () => {
            // Aseguramos que isLoading esté en true al empezar
            setIsLoading(true);
            try {
                const response = await fetch('/api/cart');
                const data = await response.json();
                setCart(data); 
            } catch (error) {
                console.error("Error al cargar los productos del carrito:", error);
            } finally {
                // --- ¡CAMBIO! ---
                // Cuando termina (con éxito o error), dejamos de cargar
                setIsLoading(false);
            }
        };
        
        loadCartData();
    }, []);

    const openCart = () => setIsCartOpen(true);
    const closeCart = () => setIsCartOpen(false);

    // --- ¡NUEVO! Funciones para controlar el modal ---
    const handleClearCartClick = () => {
        setIsModalOpen(true); // Solo abre el modal
    };

    const handleConfirmClearCart = () => {
        setCart([]); // Vacía el carrito
        setIsModalOpen(false); // Cierra el modal
    };

    const handleCancelClearCart = () => {
        setIsModalOpen(false); // Cierra el modal
    };

    const totalItemsInCart = cart.reduce((total, item) => {
        return total + item.quantity;
    }, 0);

    return (
        <div>
            <div className="container">
                <h1>PULGASHOP</h1>
                
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
                // --- ¡NUEVO! Pasamos los props ---
                isLoading={isLoading}
                onClearCartClick={handleClearCartClick} // Pasamos la función que abre el modal
            />
            
            {/* --- ¡NUEVO! Renderizamos el modal si está abierto --- */}
            {isModalOpen && (
                <ConfirmationModal
                    message="¿Estás seguro de que quieres vaciar tu carrito?"
                    onConfirm={handleConfirmClearCart}
                    onCancel={handleCancelClearCart}
                />
            )}
        </div>
    );
}