import React, { useEffect } from 'react'; 
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Consultas from './pages/Consultas';
import Formulario from './pages/Formulario';
import IngresoForm from './components/IngresoForm';
import DespachoForm from './components/DespachoForm';
import ServiciosForm from './components/ServiciosForm';
import Inicio from './pages/Inicio';
import Registro from './pages/Registro';
import Soporte from './pages/Soporte';



const App = () => {
  const { isAuthenticated } = useAuth();
  const { logout } = useAuth();

  useEffect(() => {
    if (window.electron) {
      window.electron.onLogout(() => {
        // Llamar al método logout del contexto
        logout().then(() => {
          window.close(); // Cierra la ventana después de cerrar sesión
        });
      });
    }
  }, [logout]);

 
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      {isAuthenticated ? (
        <>
          <Route path="/inicio" element={<Inicio />} />
          <Route path="/registro" element={<Registro />} />
          <Route path="/consultas" element={<Consultas />} />
          <Route path="/formulario" element={<Formulario />} />
          <Route path="/soporte" element={<Soporte />} />
          <Route path="/formulario/ingreso/:id" element={<IngresoForm />} />
          <Route path="/formulario/despacho/:id" element={<DespachoForm />} />
          <Route path="/formulario/servicios/:id" element={<ServiciosForm />} />
          <Route path="*" element={<Navigate to="/inicio" />} />
        </>
      ) : (
        <Route path="*" element={<Navigate to="/login" />} />
      )}
    </Routes>
  );
};
 
export default App;