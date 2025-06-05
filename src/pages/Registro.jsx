
import Sidebar from "../components/Layouts/Sidebar";
import Header from "../components/Layouts/Header";
import FilterSection from "../components/Registro/Filtro";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import TablaTransito from "../components/Registro/Transito";
import TablaHistorial from "../components/Registro/Historial";
import BotonesVista from "../components/Registro/BotonesVista";
import Notification from "../components/Layouts/Notificacion";
import { useAuth } from "../context/AuthContext";
import axios from 'axios'; 

const Registro = () => {
  const [viewType, setViewType] = useState("transito");
  const [filteredData, setFilteredData] = useState([]);
  const [historialData, setHistorialData] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [notification, setNotification] = useState({ message: "", type: "" });
  const navigate = useNavigate();


  const { userRole } = useAuth();


  useEffect(() => {
    const fetchData = async () => {
      const token = sessionStorage.getItem("token");
     
      try {
        if (viewType === "transito") {
          
          const response = await axios.get("https://ocean-syt-production.up.railway.app/registro/transito", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          
          setFilteredData(response.data);
        } else if (viewType === "historial") {
          const historialResponse = await axios.get("https://ocean-syt-production.up.railway.app/registro/historial",{
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          
          setHistorialData(historialResponse.data);
        }
      } catch (error) {
        setErrorMessage("Error fetching data: " + error.message);
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [viewType]);

  useEffect(() => {
    if (viewType === "transito") {
      setTableData(filteredData);
      
    } else if (viewType === "historial") {
      setTableData(historialData);
      
    }
  }, [viewType, filteredData, historialData]);

  const showTransito = () => setViewType('transito');
  const showHistorial = () => setViewType('historial');

  const handleDoubleClick = (record) => {

    if (viewType === "historial" && userRole !== "administrador") {
      setNotification({ message: "Acceso denegado: Solo los administradores pueden acceder al historial.", type: "error" });
      return;
    }

    console.log("Tipo de registro:", record.tipo);
    let formType;
    if (viewType === "transito" || viewType === "historial") {
      switch (record.tipo) {
        case "INGRESO":
          formType = "INGRESO";
          break;
        case "DESPACHO":
          formType = "DESPACHO";
          break;
        case "SERVICIOS":
          formType = "SERVICIOS";
          break;
        default:
          formType = null;
          break;
      }
    }

    if (formType) {
      console.log("Formulario a mostrar:", formType);
      navigate("/formulario", { state: { record, formType, isFinalizing: viewType === "transito", isHistorial: viewType === "historial" } });
    }
  };

  const ingresoCount = tableData.filter(record => record.tipo.tr_nombre === "INGRESO").length;
  const despachoCount = tableData.filter(record => record.tipo.tr_nombre === "DESPACHO").length;
  const serviciosCount = tableData.filter(record => record.tipo.tr_nombre === "SERVICIOS").length;

  const handleResultsChange = (data) => {
    setTableData(data);
    
  };

  return (
    <div className="h-screen w-screen font-montserrat bg-[#F2F2F2]">
      <Notification message={errorMessage} type="error" />
      <div className="flex h-full">
        <Sidebar />
        <div className="flex flex-col flex-1 w-screen h-dvh overflow-auto">
          <Header />
          <div className="m-2 p-1 h-screen overflow-auto">
            <BotonesVista
              showTransito={showTransito}
              showHistorial={showHistorial}
              viewType={viewType}
            />
            {viewType === "transito" && <div></div>}
            {viewType === "historial" && <div></div>}
            <FilterSection setTableData={handleResultsChange} consultaTipo={viewType} />
            <div className="mt-5 h-[57%] overflow-scroll text-xs 2xl:text-base">
              {viewType === "transito" && (
                <div className="h-full">
                  <TablaTransito data={tableData} onDoubleClickRow={handleDoubleClick} />
                </div>
              )}
              {viewType === "historial" && (
                <div className="h-full">
                  <TablaHistorial data={tableData} onDoubleClickRow={handleDoubleClick} />
                </div>
              )}
            </div>

            <div className="m-2 p-2 flex justify-between items-center gap-2">
              
              <div className="flex gap-4">
                <span className="font-bold">INGRESO: {ingresoCount}</span>
                <span className="font-bold">DESPACHO: {despachoCount}</span>
                <span className="font-bold">SERVICIOS: {serviciosCount}</span>
              </div>

              <Link
                to="/formulario"
                className="bg-white font-bold px-1 w-42 h-12 mt-5 hover:drop-shadow-2xl hover:bg-[#6D80A6] hover:text-[#f2f2f2] rounded content-center"
              >
                CREAR INGRESO
              </Link>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Registro;
