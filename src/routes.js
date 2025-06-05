import React from "react";
import { Routes, Route, Router } from "react-router-dom";
import Login from "./pages/Login";
import DashboardInicio from "./pages/DashboardInicio";
import Registro from "./pages/Registro";
import Formulario from "./pages/Formulario";

const routes = () => {
  return (
    <Router>
      <Routes>
        <Route path="./pages/Login.jsx" element={<Login />}>
          <Route
            path="./pages/DashboardInicio.jsx"
            element={<DashboardInicio />}
          />
          <Route path="./pages/Registro.jsx" element={<Registro />} />
          {/* <Route path="/consultas" element={<Consultas />} />
      <Route path="/soporte" element={<Soporte />} />
      <Route path="/tktsoporte" element={<TktSoporte />} /> */}
          <Route path="./pages/Formulario.jsx" element={<Formulario />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default routes;
