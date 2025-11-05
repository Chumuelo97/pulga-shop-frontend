// app/page.js
"use client";

// ¡CAMBIO! Importamos useEffect
import { useState, useEffect } from "react";
import CartDrawer from "../components/CartDrawer";
// --- ¡NUEVO! ---
import ConfirmationModal from "../components/ConfirmationModal";

export default function Home() {
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartId, setCartId] = useState(43); // ID del carrito
  const [compradorId, setCompradorId] = useState("user2"); // ID del comprador/usuario (cambiar por lógica dinámica)

  // --- ¡NUEVO! Estado para la Heurística 1 (Visibilidad) ---
  const [isLoading, setIsLoading] = useState(true); // Empezamos en 'cargando'

  // --- ¡NUEVO! Estado para la Heurística 2 (Prevención) ---
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Función para recargar el carrito desde el backend
  const loadCartData = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/cart?id=${cartId}`);

      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
      }

      const data = await response.json();
      console.log("Datos del carrito:", data); // Para debug
      // Guarda solo el array de items, no el objeto completo
      setCart(data.items || []);
    } catch (error) {
      console.error("Error al cargar los productos del carrito:", error);
      setCart([]); // Asegurar que sea array vacío en caso de error
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadCartData();
  }, [cartId]);

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);

  // --- ¡NUEVO! Funciones para controlar el modal ---
  const handleClearCartClick = () => {
    setIsModalOpen(true); // Solo abre el modal
  };

  const handleConfirmClearCart = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/cart?compradorId=${compradorId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
      }

      // Recargar el carrito desde el backend para sincronizar
      await loadCartData();
    } catch (error) {
      console.error("Error al vaciar el carrito:", error);
    } finally {
      setIsModalOpen(false); // Cierra el modal
    }
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
        className={`cart-button ${isCartOpen ? "hidden" : ""}`}
        onClick={openCart}
      >
        🛒
        {totalItemsInCart > 0 && (
          <span
            className={`cart-notification ${
              totalItemsInCart > 0 ? "visible" : ""
            }`}
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
        cartId={cartId} // Pasamos el cartId
        compradorId={compradorId} // Pasamos el compradorId
        loadCartData={loadCartData} // Pasamos la función para recargar
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
