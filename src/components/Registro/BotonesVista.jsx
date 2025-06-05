
const BotonesVista = ({ showTransito, showHistorial, viewType }) => (
  <div className="flex content-center h-[7%] m-3 p-1 gap-4 overflow-auto">
    <button
      onClick={showTransito}
      className={`w-1/4 rounded text-2xl font-bold ${
        viewType === "transito"
          ? "bg-[#182540] text-white"
          : "bg-gray-200 text-[#182540]"
      }`}
    >
      Tránsito
    </button>

    <button
      onClick={showHistorial}
      className={`w-1/4 rounded text-2xl font-bold ${
        viewType === "historial"
          ? "bg-[#182540] text-white"
          : "bg-gray-200 text-[#182540]"
      }`}
    >
      Historial
    </button>
  </div>
);

export default BotonesVista;