import React, { useEffect } from "react";

export default function Toast({ message, type = "info", onClose }) {
  useEffect(() => {
    if (!message) return;

    const timer = setTimeout(() => {
      onClose();
    }, 3000); // Fecha o toast após 3 segundos

    return () => clearTimeout(timer);
  }, [message, onClose]);

  if (!message) return null;

  const bgColors = {
    info: "bg-info text-white",
    success: "bg-success text-white",
    error: "bg-danger text-white",
    warning: "bg-warning text-dark",
  };

  return (
    <div
      className={`toast-container position-fixed top-0 end-0 p-3`}
      style={{ zIndex: 9999 }}
    >
      <div
        className={`toast show align-items-center ${bgColors[type]} border-0`}
        role="alert"
        aria-live="assertive"
        aria-atomic="true"
      >
        <div className="d-flex">
          <div className="toast-body">{message}</div>
          <button
            type="button"
            className="btn-close btn-close-white me-2 m-auto"
            aria-label="Close"
            onClick={onClose}
          ></button>
        </div>
      </div>
    </div>
  );
}