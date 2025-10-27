// components/ConfirmationModal.js
"use client";

import React from 'react';

// Este componente recibe el mensaje y las dos funciones (Confirmar / Cancelar)
export default function ConfirmationModal({ message, onConfirm, onCancel }) {
  return (
    // El fondo oscuro
    <div className="modal-overlay" onClick={onCancel}>
      {/* Detenemos la propagación del clic para que no se cierre al hacer clic en el modal */}
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <p>{message}</p>
        <div className="modal-buttons">
          <button className="btn-cancel" onClick={onCancel}>
            Cancelar
          </button>
          <button className="btn-confirm" onClick={onConfirm}>
            Confirmar
          </button>
        </div>
      </div>
    </div>
  );
}