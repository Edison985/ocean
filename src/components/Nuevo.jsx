import React, { useState } from "react";
import { Link } from "react-router-dom";
import Notification from "../components/Layouts/Notificacion";
import { useAuth } from "../context/AuthContext";
import axios from 'axios'; 

const Nuevo = () => {
  const { userName, getToken } = useAuth();
  const [mensaje, setMensaje] = useState("");
  const [archivo, setArchivo] = useState(null);
  const [topic, setTopic] = useState("");
  const [notification, setNotification] = useState({ message: "", type: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = await getToken();

      const formData = new FormData();
      formData.append("mensaje", mensaje);
      formData.append("topic", topic);
      if (archivo) {
        formData.append("archivo", archivo);
      }

      const response = await axios.post("http://127.0.0.1:5000/enviar_email", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`
        }
      });

      setNotification({ message: "Correo enviado con éxito!", type: "success" });

    } catch (error) {
      setNotification({
        message: "Error al enviar el correo: " + (error.response ? error.response.data.error : error.message),
        type: "error"
      });
    }
  };

  return (
    <div className="h-screen w-screen font-montserrat bg-[#F2F2F2]">
      {/* Renderiza la notificación si hay un mensaje */}
      {notification.message && (
        <Notification message={notification.message} type={notification.type} />
      )}
      <form onSubmit={handleSubmit} className="p-2 rounded-lg space-y-6">
        {/* Información del Tiquete */}
        <div className="bg-[#6D80A6] text-white p-1 rounded-t-lg">
          <h2 className="text-center text-xs 2xl:text-base font-semibold">
            Información del Tiquete
          </h2>
        </div>
        <div className="flex justify-around grid-cols-3 gap-1 bg-white p-4 rounded-b-lg">
          <div>
            <label className="block text-gray-700">Usuario</label>
            <input
              type="text"
              value={userName}
              className="p-2 border rounded-md w-full bg-gray-100"
              disabled
            />
          </div>
          <div>
            <label className="block mb-2 text-xs 2xl:text-base">Tema</label>
            <select
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="w-full border px-1 py-1 rounded"
            >
              <option value="">Seleccionar</option>
              <option value="Sistema">Sistema</option>
              <option value="Gestión de Registros">Gestión de Registros</option>
              <option value="Agregar Entidades">Agregar Entidades</option>
            </select>
          </div>
        </div>

        {/* Mensaje */}
        <div className="bg-[#6D80A6] text-white p-1 text-xs 2xl:text-base rounded-t-lg">
          <h2 className="text-center font-semibold">Mensaje</h2>
        </div>
        <div className="bg-white p-1 rounded-b-lg space-y-4">
          <div>
            <label className="block text-gray-700">Mensaje</label>
            <textarea
              value={mensaje}
              onChange={(e) => setMensaje(e.target.value)}
              className="p-1 border rounded-md w-full h-40"
            />
          </div>
        </div>

        {/* Adjuntos */}
        <div className="bg-[#6D80A6] text-white p-1 rounded-t-lg">
          <h2 className="text-center text-xs 2xl:text-base font-semibold">
            Adjuntos
          </h2>
        </div>
        <div className="bg-white p-1 rounded-b-lg space-y-4">
          <div className="flex items-center space-x-4">
            <label className="block text-gray-700 flex-shrink-0">Subir Archivo</label>
            <input
              type="file"
              onChange={(e) => setArchivo(e.target.files[0])}
              className="p-1 border rounded-md w-full"
            />
          </div>
        </div>

        {/* Botones */}
        <div className="flex justify-between">
          <div className="space-x-4">
            <button
              type="submit"
              className="px-2 py-2 bg-[#182540] hover:bg-[#6D80A6] hover:text-[#f2f2f2] text-white rounded-md"
            >
              Enviar
            </button>
            <button
              type="button"
              className="px-2 py-1 bg-gray-300 hover:bg-[#6D80A6] hover:text-[#f2f2f2] text-gray-700 rounded-md"
            >
              <Link to="/inicio" className="no-underline text-gray-700">
                Cancelar
              </Link>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Nuevo;
