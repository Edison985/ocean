import React, { useState } from "react";
import Nuevo from "../components/Nuevo";
import Sidebar from "../components/Layouts/Sidebar";
import Header from "../components/Layouts/Header";
import Notification from "../components/Layouts/Notificacion";
 
const Soporte = () => {  
  const [errorMessage, setErrorMessage] = useState("");  
 
  return (
    <div className="h-screen w-screen font-montserrat bg-[#F2F2F2]">
      <Notification message={errorMessage} type="error" />
      <div className="flex h-full">
        <Sidebar />
        <div className="flex flex-col flex-1 w-screen h-dvh overflow-auto">
          <Header />
          <div className="flex content-center h-14 m-3 p-1 gap-4">
            <Nuevo/>
            </div>
            </div>
       
        </div>
      </div>
   
  );
};
 
export default Soporte;