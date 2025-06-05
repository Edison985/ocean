import React from 'react';
import { useAuth } from '../../context/AuthContext'; // Importa el contexto de autenticación
import { useNavigate } from 'react-router-dom'; // Importa useNavigate para redirección

const Header = () => {
  const { userName, logout } = useAuth(); // Asegúrate de que logout está definido aquí
  const navigate = useNavigate(); // Asegúrate de que useNavigate esté importado y usado correctamente

  const today = formatDate(new Date()); // Obtén la fecha de hoy formateada

  const handleLogout = () => {
    logout(); // Llama a la función de logout del contexto
    navigate('/login'); // Redirige a la página de login
  };

  return (
    <header className="text-ocean1 items-center h-10 m-1 p-1 flex justify-end">
      <div className="flex items-center">
        <div className="flex items-center m-2 space-x-2 text-gray-800 font-semibold">
          <span>{today}</span> {/* Muestra la fecha actual */}
        </div>
        <div className="flex items-center m-2 space-x-2 text-gray-800 font-semibold">
          <span>{userName}</span> {/* Muestra el nombre del usuario */}
        </div>
        <button 
          onClick={handleLogout} 
          className="text-white bg-[#182540] hover:bg-[#6D80A6] hover:text-[#f2f2f2] font-semibold py-1 px-4 rounded ml-4"
        >
          Cerrar sesión
        </button>
      </div>
    </header>
  );
};

const formatDate = (date) => {
  const options = { year: 'numeric', month: 'long', day: 'numeric' }; // Elimina 'weekday' para no mostrar el día
  return new Date(date).toLocaleDateString('es-ES', options); // Formato sin el día de la semana
};

export default Header;
