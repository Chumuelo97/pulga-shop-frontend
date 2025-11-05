// components/CartDrawer.js
"use client";

import React from "react";

// Formateador de moneda chilena
const clpFormatter = new Intl.NumberFormat("es-CL", {
  style: "currency",
  currency: "CLP",
});

export default function CartDrawer({
  isOpen,
  onClose,
  cart,
  setCart,
  cartId,
  compradorId,
  loadCartData,
  isLoading,
  onClearCartClick,
}) {
  // Funciones para actualizar/eliminar productos
  const handleUpdateQuantity = async (productoId, action) => {
    if (action === "increase") {
      // Aumentar cantidad usando el endpoint POST agregarProductos
      try {
        console.log(`Aumentando cantidad del producto ${productoId}`);
        const response = await fetch(`/api/cart`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            compradorId: compradorId, // ID del usuario/comprador
            productoId: productoId,
            cantidad: 1, // Agrega 1 unidad más
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          console.error("Error al aumentar cantidad:", errorData);
          throw new Error(
            `Error HTTP: ${response.status} - ${JSON.stringify(errorData)}`
          );
        }

        console.log("Producto incrementado exitosamente");
        // Recargar el carrito desde el backend para sincronizar
        await loadCartData();
      } catch (error) {
        console.error("Error al aumentar cantidad:", error);
      }
    } else if (action === "decrease") {
      // Reducir cantidad usando el endpoint DELETE
      try {
        console.log(`Reduciendo cantidad del producto ${productoId}`);
        const response = await fetch(
          `/api/cart?compradorId=${compradorId}&productId=${productoId}&cantidad=1`,
          {
            method: "DELETE",
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          console.error("Error al reducir cantidad:", errorData);
          throw new Error(
            `Error HTTP: ${response.status} - ${JSON.stringify(errorData)}`
          );
        }

        console.log("Producto reducido exitosamente");
        // Recargar el carrito desde el backend para sincronizar
        await loadCartData();
      } catch (error) {
        console.error("Error al reducir cantidad:", error);
      }
    }
  };

  const handleRemoveItem = async (productoId) => {
    try {
      console.log(`Eliminando producto ${productoId} completamente`);

      // Obtener la cantidad actual del producto para eliminarlo por completo
      const item = cart.find(
        (i) => (i.productoId || i.productId) === productoId
      );
      const cantidadTotal = item ? item.cantidad || item.quantity || 999 : 999;

      // Llamar al endpoint DELETE con la cantidad total para eliminar el producto completo
      const response = await fetch(
        `/api/cart?compradorId=${compradorId}&productId=${productoId}&cantidad=${cantidadTotal}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error al eliminar producto:", errorData);
        throw new Error(
          `Error HTTP: ${response.status} - ${JSON.stringify(errorData)}`
        );
      }

      console.log("Producto eliminado exitosamente");
      // Recargar el carrito desde el backend para sincronizar
      await loadCartData();
    } catch (error) {
      console.error("Error al eliminar el producto:", error);
    }
  };

  // Cálculos
  let totalItems = 0;
  let subtotal = 0;
  cart.forEach((item) => {
    totalItems += item.cantidad || item.quantity || 0;
    const precio = item.precio || item.price || 0;
    const cantidad = item.cantidad || item.quantity || 0;
    subtotal += precio * cantidad;
  });
  const total = subtotal;

  return (
    <div id="cart-drawer" className={`cart-drawer ${isOpen ? "visible" : ""}`}>
      {/* Encabezado con el fondo verde */}
      <div className="cart-header" style={{ backgroundColor: "#E0F8E5" }}>
        <div>
          <h3>Carrito de Compras</h3>
          <span id="cart-product-count">
            {totalItems} producto{totalItems !== 1 ? "s" : ""}
          </span>
        </div>
        <button
          id="close-cart-btn"
          className="close-cart-btn"
          onClick={onClose}
        >
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
          <p style={{ padding: "20px", textAlign: "center", color: "#6c757d" }}>
            Tu carrito está vacío.
          </p>
        ) : (
          cart.map((item, index) => {
            const productoId = item.productoId || item.productId;
            const cantidad = item.cantidad || item.quantity || 0;
            const precio = item.precio || item.price || 0;
            const nombre = item.nombre || item.name || "Producto";
            const imageUrl = item.imageUrl || item.imagen || "";

            return (
              <div className="cart-product" key={productoId || index}>
                <img src={imageUrl} alt={nombre} className="product-image" />
                <div className="product-details">
                  <span className="product-name">{nombre}</span>
                  <span className="product-price">
                    {clpFormatter.format(precio)}
                  </span>
                  <span className="product-item-subtotal">
                    Subtotal: {clpFormatter.format(precio * cantidad)}
                  </span>
                </div>
                <div className="product-controls">
                  <div className="quantity-selector">
                    <button
                      className="quantity-btn"
                      onClick={() =>
                        handleUpdateQuantity(productoId, "decrease")
                      }
                    >
                      -
                    </button>
                    <span>{cantidad}</span>
                    <button
                      className="quantity-btn"
                      onClick={() =>
                        handleUpdateQuantity(productoId, "increase")
                      }
                    >
                      +
                    </button>
                  </div>
                  <button
                    className="remove-item-btn"
                    onClick={() => handleRemoveItem(productoId)}
                  >
                    ×
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* --- ¡CÓDIGO RESTAURADO! --- */}
      {/* Pie de página del carrito */}
      <div id="cart-footer" className="cart-footer">
        <div className="footer-summary">
          <span>
            Subtotal ({totalItems} producto{totalItems !== 1 ? "s" : ""}):
          </span>
          <span className="price">{clpFormatter.format(subtotal)}</span>
        </div>
        <div className="footer-summary">
          <span className="total-label">Total:</span>
          <span className="total-price">{clpFormatter.format(total)}</span>
        </div>

        {/* Aquí está el botón de pagar */}
        <button id="pay-button" className="pay-button">
          🛒 Proceder al Pago
        </button>

        <p className="footer-note">Envío calculado en el siguiente paso</p>
      </div>
      {/* --- Fin del código restaurado --- */}
    </div>
  );
}
