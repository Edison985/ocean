const TarjetaInicio = ({ label, value }) => {
    return (
      <div className="p-2 bg-[#6D80A6] w-64 h-40 xl:h-42 xl:w-80 content-center  hover:drop-shadow-2xl rounded-lg">
        <div className="w-11/12 h-3/4 xl:w-11/12 m-2 p-3 bg-[#F2F2F2] bg-opacity-25 border-l-3 border-ocean5 flex flex-col justify-center 	">
          <h3 className="m-1 text-sm font-semibold xl:text-xl">{label}</h3>
          <p className="m-1 text-2xl font-bold xl:text-3xl">{value}</p>
        </div>
      </div>
    );
  };
  
  export default TarjetaInicio;