import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import TiqueteForm from "../components/TiqueteForm";
import Sidebar from "../components/Layouts/Sidebar";
import Header from "../components/Layouts/Header";

const Formulario = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const initialData = location.state ? location.state.record : {};
  const initialFormType = location.state ? location.state.formType : "";

  const [formType, setFormType] = useState(initialFormType);
  const [isFormOpen, setIsFormOpen] = useState(true); // Estado para saber si el formulario está abierto

  return (
    <div className="font-montserrat bg-[#0000]">
      <div className="flex h-full">
        <Sidebar isFormOpen={isFormOpen} /> {/* Pasa isFormOpen a Sidebar */}
        <div className="flex flex-col flex-1 w-screen h-dvh overflow-auto">
          <Header />
          <div>
            {initialData.tiquete ? (
              <TiqueteForm initialData={initialData} formType="FINALIZAR_SERVICIOS" onClose={() => setIsFormOpen(false)} />
            ) : (
              <TiqueteForm formType={formType} initialData={initialData} onClose={() => setIsFormOpen(false)} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Formulario;
