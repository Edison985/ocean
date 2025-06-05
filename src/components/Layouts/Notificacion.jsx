  import { useEffect, useState } from "react";
  
  
  const Notification = ({ message, type, onConfirm, onCancel }) => {
    // Estado para controlar la visibilidad de la notificación
    const [visible, setVisible] = useState(!!message);
  
    // Efecto para manejar la visibilidad y el tiempo de duración de la notificación
    useEffect(() => {
      if (type === "confirmation" && message) {
        // Mantiene la notificación de confirmación visible hasta que se confirme o cancele
        return;
      }
  
      if (type === "success" || type === "error") {
        // Para notificaciones de éxito o error, oculta la notificación después de 6 segundos
        const timer = setTimeout(() => {
          setVisible(false);
          onCancel && onCancel(); // Llama a onCancel para notificar al componente padre sobre el cierre
        }, 6000); // Duración de la notificación en milisegundos
  
        return () => clearTimeout(timer); // Limpia el temporizador si el componente se desmonta antes de que termine el tiempo
      }
    }, [message, type, onConfirm, onCancel]); // Dependencias que causan la reejecución del efecto
  
    // Efecto para mostrar la notificación cuando hay un mensaje
    useEffect(() => {
      if (message) {
        setVisible(true); // Muestra la notificación si hay un mensaje
      }
    }, [message]); // Dependencia del mensaje
  
    // Si la notificación no debe ser visible o no hay mensaje, no renderiza nada
    if (!visible || !message) return null;
  
    // Clase de notificación basada en el tipo de mensaje
    const notificationClass = `notification ${type === "success" ? "bg-green-500" : type === "error" ? "bg-red-500" : "bg-yellow-500"} fixed top-0 left-0 w-full p-4 mb-3 text-white font-semibold z-50 rounded`;
  
    return (
      <div className={notificationClass}>
        {/* Muestra el mensaje de la notificación */}
        <p>{message}</p>
        {type === "confirmation" && (
          <div className="mt-2 flex justify-end space-x-2">
            {/* Botón de confirmación */}
            <button
              onClick={() => {
                onConfirm && onConfirm(); // Llama a onConfirm cuando se confirma
                setVisible(false); // Oculta la notificación después de la confirmación
              }}
              className="bg-blue-500 text-white px-3 py-1 rounded"
            >
              Confirmar
            </button>
            {/* Botón de cancelación */}
            <button
              onClick={() => {
                onCancel && onCancel(); // Llama a onCancel cuando se cancela
                setVisible(false); // Oculta la notificación después de la cancelación
              }}
              className="bg-gray-500 text-white px-3 py-1 rounded"
            >
              Cancelar
            </button>
          </div>
        )}
      </div>
    );
  };
  
  export default Notification;