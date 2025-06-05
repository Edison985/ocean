import { useState, useEffect, useCallback, useMemo } from "react";
import { Search } from "lucide-react";
import axios from 'axios';

const FilterSection = ({ setTableData, consultaTipo }) => {
  const [placa, setPlaca] = useState("");
  const [resultadosPorPagina, setResultadosPorPagina] = useState("elegir");
  const [handler, setHandler] = useState([]);

  // Función para obtener datos según el tipo de consulta
  const fetchData = useCallback(async () => {
    const token = sessionStorage.getItem("token");
    
    try {
      let result;
      if (consultaTipo === "transito") {
        const response = await axios.get(
          "https://ocean-syt-production.up.railway.app/registro/transito", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          }
           
        );
        result = response.data;
      } else if (consultaTipo === "historial") {
        const response = await axios.get(
          "https://ocean-syt-production.up.railway.app/registro/historial", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          }
           
        );
        result = response.data;
      } else {
        throw new Error("Tipo de consulta no válido");
      }

      if (Array.isArray(result)) {
        setHandler(result);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }, [consultaTipo]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Filtrar todos los registros según la placa

  const allFilteredData = useMemo(() => {
    return handler.filter(
      (item) =>
        placa === "" ||
        item.vehiculo?.vehi_placa?.toLowerCase().includes(placa.toLowerCase())
    );
  }, [handler, placa]);

  // Aplicar paginación a los datos filtrados
  const filteredData = useMemo(() => {
    if (resultadosPorPagina === "elegir") {
      return allFilteredData;
    } else {
      return allFilteredData.slice(0, Number(resultadosPorPagina));
    }
  }, [allFilteredData, resultadosPorPagina]);

  useEffect(() => {
    setTableData(filteredData);
  }, [filteredData, setTableData]);

  return (
    <div className="flex flex-col w-full p-2 bg-white rounded-lg shadow-md">
      <div className="flex justify-between items-center">
        <div className="flex flex-col gap-1">
          <label className="text-gray-600 text-xs xl:text-base">Placa</label>
          <div className="relative w-[250px]">
            <input
              type="text"
              value={placa}
              onChange={(e) => setPlaca(e.target.value)}
              placeholder="Número de placa"
              className="w-full pl-10 pr-2 py-1 text-sm rounded-md border border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500"

            />
            <Search className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          </div>
        </div>

        {/* Select de resultados por página */}
        <div className="flex items-center gap-2">
          <label className="text-gray-600 text-xs xl:text-base">
            Resultados por página
          </label>
          <select
            value={resultadosPorPagina}
            onChange={(e) => setResultadosPorPagina(e.target.value)}
            className="px-1 py-1 text-sm xl:text-lg rounded-md border border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="elegir">Elegir</option>
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={15}>15</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default FilterSection;
