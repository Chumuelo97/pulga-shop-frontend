"use client";
import React from 'react';

const clpFormatter = new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP'
});

export default function CartDrawer({ 
    isOpen, 
    onClose, 
    cart, 
    setCart 
}) {

    const handleUpdateQuantity = (index, action) => {
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
        const newCart = [...cart];
        newCart.splice(index, 1);
        setCart(newCart);
    };

    const handleClearCart = () => {
        setCart([]);
    };

    let totalItems = 0;
    let subtotal = 0;
    cart.forEach(item => {
        totalItems += item.quantity;
        subtotal += item.price * item.quantity;
    });
    const total = subtotal;

    return (
        <div id="cart-drawer" className={`cart-drawer ${isOpen ? 'visible' : ''}`}>
            <div className="cart-header">
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

            <div className="cart-actions">
                <button id="clear-cart-btn" onClick={handleClearCart}>
                    🗑️ Vaciar carrito
                </button>
            </div>
            <div id="cart-items" className="cart-items">
                {cart.length === 0 ? (
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

            <div id="cart-footer" className="cart-footer">
                <div className="footer-summary">
                    <span>Subtotal ({totalItems} producto{totalItems !== 1 ? 's' : ''}):</span>
                    <span className="price">{clpFormatter.format(subtotal)}</span>
                </div>
                <div className="footer-summary">
                    <span className="total-label">Total:</span>
                    <span className="total-price">{clpFormatter.format(total)}</span>
                </div>
                <button id="pay-button" className="pay-button" onClick={() => alert('Función "Pagar" no implementada.')}>
                    🛒 Proceder al Pago
                </button>
                <p className="footer-note">Envío calculado en el siguiente paso</p>
            </div>
        </div>
    );
}