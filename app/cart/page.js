"use client";

import { useState, useEffect } from 'react';
import Footer from '../components/Footer';

const clpFormatter = new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP'
});

export default function CartPage() {
    const [cart, setCart] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
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
                }
            } catch (error) {
                console.error("Error al cargar el carrito:", error);
            } finally {
                setIsLoading(false);
            }
        };
        loadCartData();
    }, [compradorId]);

    // Actualizar cantidad
    const handleUpdateQuantity = async (index, action) => {
        const item = cart[index];
        if (!item) return;

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

            // Recargar carrito para asegurar consistencia con backend
            const response = await fetch(`/api/cart?id=${compradorId}`);
            const data = await response.json();
            const items = Array.isArray(data) ? data : (data.productos || []);
            setCart(items);

        } catch (error) {
            console.error("Error al actualizar cantidad:", error);
        }
    };

    // Eliminar item
    const handleRemoveItem = async (index) => {
        const item = cart[index];
        if (!item) return;

        try {
            await fetch(`/api/cart?compradorId=${compradorId}&productId=${item.id}`, {
                method: 'DELETE'
            });

            // Recargar carrito
            const response = await fetch(`/api/cart?id=${compradorId}`);
            const data = await response.json();
            const items = Array.isArray(data) ? data : (data.productos || []);
            setCart(items);
        } catch (error) {
            console.error("Error al eliminar producto:", error);
        }
    };

    // Checkout
    const handleCheckout = async () => {
        if (cart.length === 0) return;

        try {
            const response = await fetch('/api/checkout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    compradorId,
                    items: cart
                })
            });

            if (response.ok) {
                const result = await response.json();
                if (result.redirectUrl) {
                    window.location.href = result.redirectUrl;
                } else {
                    alert('Error: No se recibió URL de pago.');
                }
            } else {
                alert('Hubo un problema al procesar la orden.');
            }
        } catch (error) {
            console.error('Error en checkout:', error);
            alert('Error de conexión.');
        }
    };

    let totalItems = 0;
    let subtotal = 0;
    cart.forEach(item => {
        totalItems += item.quantity;
        subtotal += item.price * item.quantity;
    });
    const total = subtotal;

    return (
        <div className="cart-page-container">
            {/* Banner Superior */}
            <header className="cart-page-header">
                <div className="cart-header-content">
                    <h1 className="cart-page-title">PulgaShop</h1>
                </div>
            </header>

            {/* Contenido Principal */}
            <main className="cart-page-main">

                <div className="cart-columns-wrapper">

                    {/* Columna Izquierda: Cesta y Productos */}
                    <div className="cart-items-column">
                        <h2 className="cart-section-title">Cesta</h2>

                        {/* Lista de Productos */}
                        <div className="cart-items-list">
                            {isLoading ? (
                                <div className="cart-loading">Cargando...</div>
                            ) : cart.length === 0 ? (
                                <div className="cart-empty-state">
                                    <div className="cart-empty-icon">🛒</div>
                                    <h3>Tu carrito está vacío</h3>
                                </div>
                            ) : (
                                cart.map((item, index) => (
                                    <div key={item.id || index} className="cart-item">
                                        <img
                                            src={item.imageUrl || "https://via.placeholder.com/100"}
                                            alt={item.name}
                                            className="cart-item-image"
                                        />
                                        <div className="cart-item-info">
                                            <h3 className="cart-item-name">{item.name}</h3>
                                            <p className="cart-item-price">{clpFormatter.format(item.price)}</p>
                                        </div>

                                        <div className="cart-item-controls">
                                            <div className="cart-quantity-wrapper">
                                                <button
                                                    onClick={() => handleUpdateQuantity(index, 'decrease')}
                                                    className="cart-quantity-btn"
                                                >-</button>
                                                <span className="cart-quantity-text">{item.quantity}</span>
                                                <button
                                                    onClick={() => handleUpdateQuantity(index, 'increase')}
                                                    className="cart-quantity-btn"
                                                >+</button>
                                            </div>
                                            <button
                                                onClick={() => handleRemoveItem(index)}
                                                className="cart-item-remove"
                                                title="Eliminar"
                                            >
                                                ×
                                            </button>
                                        </div>

                                        <div className="cart-item-total">
                                            {clpFormatter.format(item.price * item.quantity)}
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Columna Derecha: Resumen */}
                    <div className="cart-summary-column">
                        <h2 className="cart-section-title">Resumen</h2>

                        <div className="cart-summary-card">
                            <div className="cart-summary-row">
                                <span>Estimación total</span>
                                <span>{clpFormatter.format(total)}</span>
                            </div>

                            <button
                                className="cart-checkout-btn"
                                onClick={handleCheckout}
                                disabled={cart.length === 0}
                            >
                                Procesar pago y continuar ({totalItems})
                            </button>

                            <hr className="cart-divider" />

                            {/* Trust Badges */}
                            <div className="cart-trust-section">
                                <h4 className="cart-trust-title">
                                    Info &gt;
                                </h4>
                                <p className="cart-trust-text">
                                    <span className="cart-check-icon">✓</span> test<br />
                                    <span className="cart-check-icon">✓</span> test<br />
                                    <span className="cart-check-icon">✓</span> test
                                </p>
                            </div>

                            <div className="cart-trust-section">
                                <h4 className="cart-trust-title">
                                    Seguridad & Privacidad &gt;
                                </h4>
                                <p className="cart-trust-text">
                                    Pagos seguros · Datos personales seguros
                                </p>
                            </div>

                            <div>
                                <h4 className="cart-trust-title">
                                    Pagos seguros
                                </h4>
                                <div className="cart-payment-icons">
                                    {/* Placeholder icons using text/emoji for simplicity */}
                                    <span className="cart-payment-icon">VISA</span>
                                    <span className="cart-payment-icon">Mastercard</span>
                                    <span className="cart-payment-icon">PayPal</span>
                                </div>

                            </div>

                        </div>
                    </div>

                </div>
            </main>

            {/* Banner Inferior */}
            {/* Banner Inferior */}
            <Footer />

        </div>
    );
}
