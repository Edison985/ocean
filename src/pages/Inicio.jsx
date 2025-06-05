import Sidebar from "../components/Layouts/Sidebar";
import Header from "../components/Layouts/Header";
import { Link } from "react-router-dom";
import React, { useEffect, useState } from "react";
import Notification from "../components/Layouts/Notificacion";
import TarjetaInicio from "../components/Layouts/TarjetaInicio";
import axios from 'axios';

function Inicio() {
  const [errorMessage, setErrorMessage] = useState("");
  const [data, setData] = useState({
    ingresos: [],
    despachos: [],
    totalIngresos: "0.000",
    totalDespachos: "0.000",
  });

  useEffect(() => {
    const token = sessionStorage.getItem("token");
    if (!token) {
      setErrorMessage("No se encontró el token. Inicia sesión.");
      return;
    }

    // Obtener datos de despachos
    axios
      .get("https://ocean-syt-production.up.railway.app/registro/estadistica/despachos", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        const { total_peso_neto, destinos } = response.data;

        const formattedDespachos = Object.keys(destinos || {}).map((destino) => ({
          label: destino,
          value: `${destinos[destino].peso_neto_destino} kg`,
        }));

        setData((prevData) => ({
          ...prevData,
          despachos: formattedDespachos,
          totalDespachos: total_peso_neto || "0.000",
        }));
      })
      .catch((error) => {
        console.error("Error en despachos:", error);
        setErrorMessage("Error al obtener los datos de despachos");
      });

    // Obtener datos de ingresos
    axios
      .get("https://ocean-syt-production.up.railway.app/registro/estadistica/ingresos", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        const { total_peso_neto, productos } = response.data;

        const formattedIngresos = Object.keys(productos || {}).map((producto) => ({
          label: producto,
          value: `${productos[producto].peso_neto_producto} kg`,
        }));

        setData((prevData) => ({
          ...prevData,
          ingresos: formattedIngresos,
          totalIngresos: total_peso_neto || "0.000",
        }));
      })
      .catch((error) => {
        console.error("Error en ingresos:", error);
        setErrorMessage("Error al obtener los datos de ingresos");
      });
  }, []);


  // Filtrar datos para mostrar solo aquellos con valores mayores a 0
  const filteredIngresos = data.ingresos.filter(
    (item) => parseFloat(item.value) > 0
  );

  const filteredDespachos = data.despachos.filter(
    (item) => parseFloat(item.value) > 0
  );

  return (
    <div className="min-h-screen w-full font-montserrat bg-[#F2F2F2]">
      <Notification message={errorMessage} type="error" />
      <div className="flex h-full">
        <Sidebar />
        <div className="flex flex-col flex-1 w-full overflow-auto">
          <Header />
          <div className="m-2 p-4 content-center">
            {/* Sección de Ingresos */}
            <div className="m-1 p-3">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">INGRESOS</h2>
                <div className="bg-blue-100 p-2 rounded-md">
                  <span className="font-semibold">Total: </span>
                  <span className="font-bold">{data.totalIngresos} Ton</span>
                </div>
              </div>

              <div className="m-2 p-2 flex flex-nowrap overflow-auto">
                {filteredIngresos.length > 0 ? (
                  <div className="flex flex-row gap-6">
                    {filteredIngresos.map((item, index) => (
                      <TarjetaInicio
                        key={index}
                        label={item.label}
                        value={item.value}
                      />
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 italic">
                    No hay ingresos registrados para hoy
                  </p>
                )}
              </div>
            </div>

            {/* Sección de Despachos */}
            <div className="m-2 p-5">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">DESPACHOS</h2>
                <div className="bg-green-100 p-2 rounded-md">
                  <span className="font-semibold">Total: </span>
                  <span className="font-bold">{data.totalDespachos} Ton</span>
                </div>
              </div>

              <div className="m-2 p-2 flex flex-nowrap overflow-auto">
                {filteredDespachos.length > 0 ? (
                  <div className="flex flex-row gap-6">
                    {filteredDespachos.map((item, index) => (
                      <TarjetaInicio
                        key={index}
                        label={item.label}
                        value={item.value}
                      />
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 italic">
                    No hay despachos registrados para hoy
                  </p>
                )}
              </div>
            </div>

            {/* Botones de acción */}
            <div className="m-2 p-2 flex justify-end gap-4">
              <Link to="/formulario">
                <button className="bg-white font-bold px-6 py-3 hover:drop-shadow-2xl hover:bg-[#6D80A6] hover:text-[#f2f2f2] rounded">
                  CREAR INGRESO
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Inicio;
