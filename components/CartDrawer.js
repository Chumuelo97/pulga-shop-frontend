// components/CartDrawer.js
"use client";

import React from 'react';

// Formateador de moneda chilena
const clpFormatter = new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP'
});

export default function CartDrawer({
    isOpen,
    onClose,
    cart,
    setCart,
    isLoading,
    onClearCartClick,
    ...props
}) {

    // Funciones para actualizar/eliminar
    const handleUpdateQuantity = (index, action) => {
        if (props.onUpdateQuantity) {
            props.onUpdateQuantity(index, action);
            return;
        }

        const newCart = [...cart];
        const item = newCart[index];
        if (action === 'increase') {
            item.quantity++;
        } else if (action === 'decrease') {
            item.quantity--;
            if (item.quantity <= 0) {
                newCart.splice(index, 1);
            }
        }
        setCart(newCart);
    };

    const handleRemoveItem = (index) => {
        if (props.onRemoveItem) {
            props.onRemoveItem(index);
            return;
        }

        const newCart = [...cart];
        newCart.splice(index, 1);
        setCart(newCart);
    };


    // Cálculos (sin cambios)
    let totalItems = 0;
    let subtotal = 0;
    cart.forEach(item => {
        totalItems += item.quantity;
        subtotal += item.price * item.quantity;
    });
    const total = subtotal;

    return (
        <div id="cart-drawer" className={`cart-drawer ${isOpen ? 'visible' : ''}`}>

            {/* Encabezado con el fondo verde */}
            <div className="cart-header" style={{ backgroundColor: '#E0F8E5' }}>
                <div>
                    <h3>Carrito de Compras</h3>
                    <span id="cart-product-count">
                        {totalItems} producto{totalItems !== 1 ? 's' : ''}
                    </span>
                </div>
                <button id="close-cart-btn" className="close-cart-btn" onClick={onClose}>
                    &times;
                </button>
            </div>

            {/* Acción de Vaciar Carrito (sin cambios) */}
            <div className="cart-actions">
                <button id="clear-cart-btn" onClick={onClearCartClick}>
                    🗑️ Vaciar carrito
                </button>
            </div>

            {/* Lista de Items (con el spinner de carga) */}
            <div id="cart-items" className="cart-items">
                {isLoading ? (
                    <div className="loading-spinner-container">
                        <div className="loading-spinner"></div>
                    </div>
                ) : cart.length === 0 ? (
                    <p style={{ padding: '20px', textAlign: 'center', color: '#6c757d' }}>
                        Tu carrito está vacío.
                    </p>
                ) : (
                    cart.map((item, index) => (
                        <div className="cart-product" key={item.id}>
                            <img
                                src={item.imageUrl}
                                alt={item.name}
                                className="product-image"
                            />
                            <div className="product-details">
                                <span className="product-name">{item.name}</span>
                                <span className="product-price">
                                    {clpFormatter.format(item.price)}
                                </span>
                                <span className="product-item-subtotal">
                                    Subtotal: {clpFormatter.format(item.price * item.quantity)}
                                </span>
                            </div>
                            <div className="product-controls">
                                <div className="quantity-selector">
                                    <button
                                        className="quantity-btn"
                                        onClick={() => handleUpdateQuantity(index, 'decrease')}>-</button>
                                    <span>{item.quantity}</span>
                                    <button
                                        className="quantity-btn"
                                        onClick={() => handleUpdateQuantity(index, 'increase')}>+</button>
                                </div>
                                <button
                                    className="remove-item-btn"
                                    onClick={() => handleRemoveItem(index)}>×</button>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* --- ¡CÓDIGO RESTAURADO! --- */}
            {/* Pie de página del carrito */}
            <div id="cart-footer" className="cart-footer">
                <div className="footer-summary">
                    <span>Subtotal ({totalItems} producto{totalItems !== 1 ? 's' : ''}):</span>
                    <span className="price">{clpFormatter.format(subtotal)}</span>
                </div>
                <div className="footer-summary">
                    <span className="total-label">Total:</span>
                    <span className="total-price">{clpFormatter.format(total)}</span>
                </div>

                {/* Aquí está el botón de pagar */}
                <button
                    id="pay-button"
                    className="pay-button"
                >
                    🛒 Proceder al Pago
                </button>

                <p className="footer-note">Envío calculado en el siguiente paso</p>
            </div>
            {/* --- Fin del código restaurado --- */}

        </div>
    );
}