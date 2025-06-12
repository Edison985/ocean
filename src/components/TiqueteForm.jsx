import React, { useState, useEffect, useRef } from "react";
import moment from "moment-timezone";
import SelectField from "./Layouts/SelectField";
import FormSection from "./FormSection";
import IngresoForm from "./IngresoForm";
import DespachoForm from "./DespachoForm";
import ServiciosForm from "./ServiciosForm";
import InputField from "./Layouts/InputField";
import { useLocation, useNavigate } from "react-router-dom";
import Notification from "./Layouts/Notificacion";
import { CursorArrowRaysIcon } from "@heroicons/react/24/solid";
import axios from "axios";


const TiqueteForm = ({ formType: initialFormType, initialData }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const [formType, setFormType] = useState(
    location.state?.formType || initialFormType
  );
  const [vehicleInfo, setVehicleInfo] = useState({
    vehiculo: initialData.vehiculo_placa || "",
    id: initialData.vehiculo_id || null,
  });
  const [trailerInfo, setTrailerInfo] = useState({
    trailer: initialData.trailer_placa || "",
    id: initialData.trailer_id || null,
  });
  const [facturaInfo, setFacturaInfo] = useState({
    factura: initialData.factura_fecha || "",
    id: initialData.factura_id || null,
  });
  const [conductInfo, setConductInfo] = useState({
    conductor: initialData.conductor_nombre || "",
    cedula: initialData.conductor_cedula || "",
    id: initialData.conductor_id || null,
  });
  const [peso, setPeso] = useState({
    tara: initialData.peso_tara || "",
    bruto: initialData.peso_bruto || "",
    neto: initialData.peso_neto || "",
  });

  const [currentDate, setCurrentDate] = useState("");
  const [currentTime, setCurrentTime] = useState("");
  const [isFinalizing] = useState(location.state?.isFinalizing || false);
  const [isHistorial] = useState(location.state?.isHistorial || false);
  const [isTiquete] = useState(location.state?.isTiquete || false);
  const [isProcessing, setIsProcessing] = useState(false); // Nuevo estado para controlar el procesamiento
  const [isTiqueteFinalizado, setIsTiqueteFinalizado] = useState(false);
  const [notification, setNotification] = useState({ message: "", type: "" });
  const [showAlertaSalir, setShowAlertaSalir] = useState(false);

  const [consecutivo, setConsecutivo] = useState(initialData.consecutivo || "");
  const [consecutivoTiquete, setConsecutivoTiquete] = useState(initialData.consecutivo_tiquete || "");


  const [observaciones, setObservaciones] = useState(
    initialData.observaciones || ""
  );
  const [fechaEntrada, setFechaEntrada] = useState(
    initialData.fecha_entrada || ""
  );
  const [horaEntrada, setHoraEntrada] = useState(
    initialData.hora_entrada || ""
  );
  const [fechaSalida, setFechaSalida] = useState(
    initialData.fecha_salida || ""
  );
  const [horaSalida, setHoraSalida] = useState(
    initialData.hora_salida || ""
  );

  //CAMBIOS
  const [vehicleOptions, setVehicleOptions] = useState([]); // Nuevo estado
  const [conductorOptions, setConductorOptions] = useState([]); // Nuevo estado
  const [cedulaOptions, setCedulaOptions] = useState([]);
  const [trailerOptions, setTrailerOptions] = useState([]);
  const [facturaOptions, setFacturaOptions] = useState([]);


  const ingresoFormRef = useRef();
  const despachoFormRef = useRef();
  const servicioFormRef = useRef();

  useEffect(() => {
    const now = moment().tz("America/Bogota");
    setCurrentDate(now.format("YYYY-MM-DD"));
    setCurrentTime(now.format("HH:mm"));
  }, []);

  useEffect(() => {
    const fetchConsecutivo = async () => {
      const token = sessionStorage.getItem('token');

      if (
        (formType === "INGRESO" ||
          formType === "DESPACHO" ||
          formType === "SERVICIOS") &&
        !consecutivo &&
        !isFinalizing &&
        !isHistorial
      ) {
        const registro = await axios.get("https://ocean-syt-production.up.railway.app/registro/consecutivo", {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log("CONSECUTIVO REGISTRO AMERICANO ###", registro.data);
        setConsecutivo(registro.data.proximo_id);
      }
    };

    fetchConsecutivo();
  }, [formType, isFinalizing, isHistorial]);

  useEffect(() => {
    const fetchTiquete = async () => {
      const token = sessionStorage.getItem('token');

      if (
        (formType === "INGRESO" ||
          formType === "DESPACHO" ||
          formType === "SERVICIOS") &&
        !consecutivoTiquete &&
        (isFinalizing || isTiquete || isHistorial)
      ) {
        const tiquete = await axios.get("https://ocean-syt-production.up.railway.app/registro/tiquete", {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log("CONSECUTIVO DE TIQUETE #####", tiquete.data);
        setConsecutivoTiquete(tiquete.data.proximo_id_tiquete);
      }
    };

    fetchTiquete();
  }, [formType, isFinalizing, isTiquete, isHistorial]);

  
  const fetchVehiculos = async () => {
    const token = sessionStorage.getItem("token");
    
    try {
      const response = await axios.get("https://ocean-syt-production.up.railway.app/vehiculo/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
      );

      // Guarda todos los datos completos en options
      return response.data.map((vehiculo) => ({
        value: vehiculo.vehi_id,
        label: vehiculo.vehi_placa,
      }));
    } catch (error) {
      console.error("Error fetching vehicle options:", error);
      return [];
    }
  };

  const fetchTrailers = async () => {
    const token = sessionStorage.getItem("token");
   
    try {
      const response = await axios.get("https://ocean-syt-production.up.railway.app/trailer/", {
        headers: {
            Authorization: `Bearer ${token}`,
        },
      });

      return response.data.map((trailer) => ({
        value: trailer.trai_id,
        label: trailer.trai_placa,
      }));
    } catch (error) {
      console.error("Error fetching trailer options:", error);
      return [];
    }
  };

  const fetchFacturas = async () => {
    const token = sessionStorage.getItem("token");
    
    try {
      const response = await axios.get("https://ocean-syt-production.up.railway.app/factura/", {
        headers: {
            Authorization: `Bearer ${token}`,
        },
      });

      return response.data.map((factura) => ({
        value: factura.fac_id,
        label: factura.fac_fecha,
      }));
    } catch (error) {
      console.error("Error fetching factura options:", error);
      return [];
    }
  };

  const fetchConductores = async () => {
    const token = sessionStorage.getItem("token");
    
    try {
      const response = await axios.get("https://ocean-syt-production.up.railway.app/conductor/", {
        headers: {
            Authorization: `Bearer ${token}`,
        },
      });

      return response.data.map((conductor) => ({
        value: conductor.conduct_id, // Almacena el ID del conductor
        label: conductor.conduct_nombre, // Almacena el nombre del conductor
      }));
    } catch (error) {
      console.error("Error fetching conductor options:", error);
      return [];
    }
  };

  const fetchConductorCedula = async () => {
    const token = sessionStorage.getItem("token");
   
    try {
      const response = await axios.get("https://ocean-syt-production.up.railway.app/conductor/", {
        headers: {
            Authorization: `Bearer ${token}`,
        },
      });

      return response.data.map((conductor) => ({
        value: conductor.conduct_id, // Almacena el ID del conductor
        label: conductor.conduct_cedula, // Almacena el nombre del conductor
      }));
    } catch (error) {
      console.error("Error fetching conductor options:", error);
      return [];
    }
  };

  const refreshOptions = async () => {
    const nuevoVehiculo = await fetchVehiculos();
    const nuevoTrailer = await fetchTrailers();
    const nuevoConductorCedula = await fetchConductorCedula();
    const nuevoConductor = await fetchConductores()
    const nuevaFactura = await fetchFacturas();
 
    setVehicleOptions(nuevoVehiculo);
    setTrailerOptions(nuevoTrailer);
    setConductorOptions(nuevoConductor);
    setCedulaOptions(nuevoConductorCedula);
    setFacturaOptions(nuevaFactura);


  };

  useEffect(() => {
    const fetchOptions = async () => {
      const vehiculos = await fetchVehiculos();
      const trailers = await fetchTrailers();
      const facturas = await fetchFacturas();
      const conductores = await fetchConductores();
      const cedulaConductor = await fetchConductorCedula();

      setFacturaOptions(facturas);
      setVehicleOptions(vehiculos);
      setTrailerOptions(trailers);
      setConductorOptions(conductores);
      setCedulaOptions(cedulaConductor);
    };

    fetchOptions();
  }, []);

  const handlePlacaChange = (selectedOption) => {
    if (selectedOption) {
      setVehicleInfo({
        vehiculo: selectedOption.label, // la placa
        id: selectedOption.value, // el ID que ya viene en selectedOption
      });
    } else {
      setNotification({ message: "Vehículo no encontrado", type: "error" });
    }
  };

  const handleTrailerChange = (selectedOption) => {
    if (selectedOption) {
      setTrailerInfo({
        trailer: selectedOption.label, // la placa
        id: selectedOption.value, // el ID que ya viene en selectedOption
      });
    } else {
      setNotification({ message: "Trailer no encontrado", type: "error" });
    }
  };

  const handleFacturaChange = (selectedOption) => {
    if (selectedOption) {
      setFacturaInfo({
        factura: selectedOption.label,
        id: selectedOption.value,
      });
    } else {
      setNotification({ message: "Factura no encontrada", type: "error" });
    }
  };

  const handleConductorChange = (selectedOption) => {
    if (selectedOption) {
      setConductInfo({
        conductor: selectedOption.label, // la placa
        id: selectedOption.value, // el ID que ya viene en selectedOption
      });
    } else {
      setNotification({ message: "Factura no encontrado", type: "error" });
    }
  };

  useEffect(() => {
    const tara = peso.tara || 0;
    const bruto = peso.bruto || 0;
    const neto = formType === "DESPACHO" ? bruto - tara : bruto - tara;
    setPeso((prevPeso) => ({
      ...prevPeso,
      neto: neto,
    }));
  }, [peso.tara, peso.bruto]);

  const handlePesoBrutoChange = (e) => {
    const value = e.target.value.replace(/\./g, ""); // Elimina puntos de mil si existen
    setPeso((prevPeso) => ({
      ...prevPeso,
      bruto: parseInt(value, 10) || null, // Conviértelo a número entero
    }));
  };

  const handlePesoTaraChange = (e) => {
    const value = e.target.value.replace(/\./g, ""); // Elimina puntos de mil si existen
    setPeso((prevPeso) => ({
      ...prevPeso,
      tara: parseInt(value, 10) || null, // Conviértelo a número entero
    }));
  };

  const handleSubmitRegistro = async (registroData, tipoId) => {
    const token = sessionStorage.getItem("token");
    try {
    
      await axios.post(
        "https://ocean-syt-production.up.railway.app/registro/",
        {
          ...registroData,
          reg_idtipo: tipoId, // Ahora usamos reg_idtipo como lo espera el backend
          reg_fechaentrada: currentDate,
          reg_horaentrada: currentTime,
          reg_pesobruto:
            formType === "INGRESO" || formType === "SERVICIOS"
              ? peso.bruto
              : null,
          reg_pesotara: formType === "DESPACHO" ? peso.tara : null,
          reg_idvehiculo: vehicleInfo.id,
          reg_idtrailer: trailerInfo.id,
          reg_idconductor: conductInfo.id,
          reg_idfactura: facturaInfo.id,
          reg_observaciones: observaciones,
          reg_consecutivo: consecutivo,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
        
      );
      setNotification({message: "Registro procesado exitosamente",type: "success",});
    } catch (error) {
      setNotification({message:"Error procesando registro: " +(error.response ? error.response.data.error : error.message),type: "error",});
    }
  };
  
  const handleActualizarRegistro = async (finalizarData) => {
    const reg_id = initialData.registro_id;
    const token = sessionStorage.getItem("token");
    
    const isFinalizing = location.state?.isFinalizing || false; // Revisar si estamos finalizando
    try {
      await axios.put(
        `https://ocean-syt-production.up.railway.app/registro/${reg_id}`, // ← comillas invertidas correctas
        {
          ...finalizarData,
          reg_fechaentrada: fechaEntrada || initialData.fecha_entrada,
          reg_horaentrada: horaEntrada || initialData.hora_entrada,
          reg_fechasalida: fechaSalida || currentDate || initialData.fecha_salida,
          reg_horasalida: horaSalida || currentTime || initialData.hora_salida,
          reg_pesotara: peso.tara,
          reg_pesobruto: peso.bruto,
          reg_pesoneto: peso.neto,
          reg_observaciones: observaciones || "",
          reg_idvehiculo: vehicleInfo.id || null,
          reg_idconductor: conductInfo.id || null,
          reg_idtrailer: trailerInfo.id || null,
          reg_idfactura: facturaInfo.id || null,
          ...(isFinalizing && { reg_tiquete: consecutivoTiquete }),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
        
      );

      if (isFinalizing) {
        setIsTiqueteFinalizado(true);
        setNotification({
          message: "Tiquete finalizado exitosamente",
          type: "success",
        });
      } else {
        setNotification({
          message: "Registro actualizado exitosamente",
          type: "success",
        });
      }
    } catch (error) {
      console.error("Error al finalizar tiquete:", error);
      setNotification({
        message:
          "Error finalizando tiquete: " +
          (error.response?.data?.message || error.message),
        type: "error",
      });
    }
  };

  const handleImprimirTiquete = async () => {
    const token = sessionStorage.getItem("token");
    const reg_id = initialData.registro_id;
    try {
     
      const response = await axios.get(
        `https://ocean-syt-production.up.railway.app/registro/imprimir/${reg_id}`,
        {
          responseType: "blob",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          
        }
      );

      const url = window.URL.createObjectURL(
        new Blob([response.data], { type: "application/pdf" })
      );
      window.open(url, "_blank");
      window.URL.revokeObjectURL(url);

      setNotification({
        message: "Tiquete imprimido exitosamente",
        type: "success",
      });
    } catch (error) {
      setNotification({
        message: "Error al imprimir el tiquete: " + error.message,
        type: "error",
      });
    }
  };

  const handleProcesarIngreso = () => {
    let data = {};
    if (ingresoFormRef.current) {
      ingresoFormRef.current.handleProcesar();
      data = ingresoFormRef.current.getFormData();
    }
    handleSubmitRegistro(data, 1);
  };

  const handleProcesarDespacho = () => {
    let data = {};
    if (despachoFormRef.current) {
      despachoFormRef.current.handleProcesar();
      data = despachoFormRef.current.getFormData();
    }
    handleSubmitRegistro(data, 2);
  };

  const handleProcesarServicios = () => {
    let data = {};
    if (servicioFormRef.current) {
      servicioFormRef.current.handleProcesar();
      data = servicioFormRef.current.getFormData();
    }
    handleSubmitRegistro(data, 3);
  };

  const handleProcesar = async () => {
    if (isProcessing) return; // Evitar procesar si ya se está procesando

    if (!vehicleInfo.vehiculo || !conductInfo.conductor) {
      setNotification({
        message:
          "Por favor complete los campos obligatorios: Placa, Conductor ",
        type: "error",
      });
      return;
    }

    setIsProcessing(true); // Desactivar el botón
    try {
      if (formType === "SERVICIOS") {
        handleProcesarServicios();
      } else if (formType === "INGRESO") {
        handleProcesarIngreso();
      } else if (formType === "DESPACHO") {
        handleProcesarDespacho();
      }
      navigate("/registro");
    } finally {
      setIsProcessing(false); // Reactivar el botón después del procesamiento
    }
  };

  const handleActualizar = async () => {
    if (isProcessing) return;

    setIsProcessing(true);

    try {
      let data = {};

      if (formType === "SERVICIOS" && servicioFormRef.current) {
        data = servicioFormRef.current.getFormData();
      } else if (formType === "INGRESO" && ingresoFormRef.current) {
        data = ingresoFormRef.current.getFormData();
      } else if (formType === "DESPACHO" && despachoFormRef.current) {
        data = despachoFormRef.current.getFormData();
      }

      await handleActualizarRegistro(data);
    } finally {
      setIsProcessing(false);
    }
  };

  const formTypes = [
    { value: "", label: "Seleccione un formulario" },
    { value: "INGRESO", label: "Ingreso" },
    { value: "DESPACHO", label: "Despacho" },
    { value: "SERVICIOS", label: "Servicios" },
  ];

  const handleFormTypeChange = (selectedOption) => {
    setFormType(selectedOption ? selectedOption.value : "");
    
  };

  const handleFetchPesoTara = async () => {
    try {
      const response = await axios.get("http://localhost:8000/bascula/peso");
      setPeso((prevPeso) => ({
        ...prevPeso,
        tara: response.data.peso, // Solo actualiza tara
      }));
    } catch (error) {
      console.error("Error fetching Peso Tara:", error);
    }
  };

  const handleFetchPesoBruto = async () => {
    try {
      const response = await axios.get("http://localhost:8000/bascula/peso");
      setPeso((prevPeso) => ({
        ...prevPeso,
        bruto: response.data.peso, // Solo actualiza bruto
      }));
    } catch (error) {
      console.error("Error fetching Peso Bruto:", error);
    }
  };


  const handleSalir = async () => {
    if (isHistorial || isTiquete || isFinalizing) {
      navigate("/registro")

    } else {
      setShowAlertaSalir(true); // Mostrar modal
    }
  };

  const confirmarSalida = () => {
    setShowAlertaSalir(false);
    navigate("/registro");
  };

  const cancelarSalida = () => {
    setShowAlertaSalir(false);
  };

  return (
    <div className="mx-auto p-1 ">
      <div className="rounded p-1 ">
        <div className="bg-[#6D80A6] text-white font-bold text-lg m-1 h-9 rounded justify-around items-center">
          <div className="grid grid-cols-7 gap-2 items-center justify-around">
            <div className="ml-1 p-1 flex w-11/12 col-span-3 ">
              <label className="text-xs 2xl:text-base text-center w-20 font-bold m-1 block mr-1">
                Registro
              </label>

              {isHistorial || isTiquete || isFinalizing ? (
                <>
                  <input
                    className="bg-white text-red-800 w-28 xl:w-3/4 text-sm 2xl:textlg text-center h-6 p-2 mr-3 focus:outline-none focus:ring-2 focus:[#6D80A6]"
                    value={consecutivo}
                    readOnly
                  />

                  <label className="text-xs 2xl:text-base text-center w-20 font-bold m-1 block mr-1">
                    Tiquete
                  </label>

                  <input
                    className="bg-white w-28 xl:w-3/4 text-sm 2xl:textlg text-center text-[#182540] h-6 px-1 focus:outline-none focus:ring-2 focus:[#6D80A6]"
                    value={consecutivoTiquete}
                    readOnly
                  />
                </>
              ) : (
                <input
                  className="bg-white w-28 xl:w-3/4 text-base 2xl:textlg text-center text-[#182540] h-6 px-1 focus:outline-none focus:ring-2 focus:[#6D80A6]"
                  value={consecutivo}
                  readOnly
                />
              )}
            </div>

            <div className="col-span-2">
              {formType === "INGRESO" && (
                <SelectField
                  options={facturaOptions}
                  onChange={handleFacturaChange}
                  value={facturaInfo.id}
                  apiUrl="https://ocean-syt-production.up.railway.app/factura/"
                  fieldType="factura"
                  showAddNew={true}
                  onAfterSave={refreshOptions}
                  className="appearance-none text-xs 2xl:text-base w-full h-7 border-2 border-[#6D80A6] rounded p-1 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-[#6D80A6]"
                />
              )}
            </div>
            <div className="col-span-2">
              <SelectField
                label="Tipo"
                id="formType"
                options={formTypes}
                value={formType}
                onChange={handleFormTypeChange}
                isDisabled={isFinalizing || isHistorial || isTiquete}
              />
            </div>
          </div>
        </div>
        <FormSection title="Datos del Vehículo">
          <div className="grid grid-cols-5">
            {/* Placa */}
            <div className="m-1 w-full">
              <label className="text-xs 2xl:text-base font-bold m-1 block text-center">
                Placa
              </label>

              <SelectField
                options={vehicleOptions}
                onChange={handlePlacaChange}
                value={vehicleInfo.id}
                apiUrl="https://ocean-syt-production.up.railway.app/vehiculo/"
                fieldType="placa"
                showAddNew={true}
                onAfterSave={refreshOptions}
                className="appearance-none text-xs 2xl:text-base w-full h-7 border-2 border-[#6D80A6] rounded p-1 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-[#6D80A6]"
              />
            </div>

            {/* Conductor (ocupa 2 columnas y está centrado) */}
            <div className="m-1 w-full col-span-2">
              <label className="text-xs 2xl:text-base font-bold m-1 block text-center">
                Conductor
              </label>
              <SelectField
                options={conductorOptions}
                onChange={handleConductorChange}
                value={conductInfo.id}
                apiUrl="https://ocean-syt-production.up.railway.app/conductor/"
                fieldType="conductor"
                showAddNew={true}
                onAfterSave={refreshOptions}
                className="appearance-none text-xs 2xl:text-base w-full h-7 border-2 border-[#6D80A6] rounded p-1 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-[#6D80A6]"
              />
            </div>

            {/* Nro. Documento (ocupa 2 columnas) */}
            <div className="m-1 w-full ">
              <label className="text-xs 2xl:text-base font-bold m-1 block text-center">
                Nro. Documento
              </label>
              <SelectField
                options={cedulaOptions}
                onChange={handleConductorChange}
                value={conductInfo.id}
                apiUrl="https://ocean-syt-production.up.railway.app/conductor/"
                fieldType="conductor"
                showAddNew={true}
                onAfterSave={refreshOptions}
                className="appearance-none text-xs 2xl:text-base w-full h-7 border-2 border-[#6D80A6] rounded p-1 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-[#6D80A6]"
              />
            </div>

            {/* Tráiler (solo si aplica) */}
            {(formType === "DESPACHO" ||
              formType === "INGRESO" ||
              formType === "SERVICIOS" ||
              formType.startsWith("FINALIZAR")) && (
              <div className="m-1 w-3/4">
                <label className="text-xs 2xl:text-base text-red-500 font-bold m-1 block text-center">
                  Tráiler
                </label>
                <SelectField
                  options={trailerOptions}
                  onChange={handleTrailerChange}
                  value={trailerInfo.id}
                  apiUrl="https://ocean-syt-production.up.railway.app/trailer/"
                  fieldType="trailer"
                  showAddNew={true}
                  className="appearance-none text-xs 2xl:text-base w-full h-7 border-2 border-[#6D80A6] rounded p-1 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-[#6D80A6]"
                />
              </div>
            )}
          </div>
        </FormSection>

        {formType === "INGRESO" && (
          <IngresoForm
            ref={ingresoFormRef}
            vehicleInfo={vehicleInfo}
            pesoBruto={peso.bruto}
            pesoTara={peso.tara}
            handlePesoBrutoChange={handlePesoBrutoChange}
            handlePesoTaraChange={handlePesoTaraChange}
            onSubmit={handleSubmitRegistro}
            onActualizar={handleActualizarRegistro}
          />
        )}

        {formType === "DESPACHO" && (
          <DespachoForm
            ref={despachoFormRef}
            vehicleInfo={vehicleInfo}
            pesoTara={peso.tara}
            pesoBruto={peso.bruto}
            handlePesoTaraChange={handlePesoTaraChange}
            handlePesoBrutoChange={handlePesoBrutoChange}
            onSubmit={handleSubmitRegistro}
            onActualizar={handleActualizarRegistro}
          />
        )}

        {formType === "SERVICIOS" && (
          <ServiciosForm
            ref={servicioFormRef}
            vehicleInfo={vehicleInfo}
            pesoBruto={peso.bruto}
            handlePesoBrutoChange={handlePesoBrutoChange}
            onSubmit={handleSubmitRegistro}
            onActualizar={handleActualizarRegistro}
          />
        )}

        <section>
          <FormSection title="Báscula">
            <div className="grid grid-cols-3 gap-1">
              <InputField
                label="Fecha Entrada"
                id="fechaEntrada"
                type="date"
                value={
                  fechaEntrada
                    ? fechaEntrada
                    : initialData.fEntrada || currentDate
                }
                onChange={(e) => setFechaEntrada(e.target.value)}
                tabIndex="-1"
              />
              <InputField
                label="Hora Entrada"
                id="horaEntrada"
                type="time"
                value={
                  horaEntrada
                    ? horaEntrada
                    : initialData.hEntrada || currentTime
                }
                onChange={(e) => setHoraEntrada(e.target.value)}
                tabIndex="-1"
              />
              {formType === "DESPACHO" ? (
                <>
                  <div className="m-0 p-1 flex w-full justify-between">
                    <label className="text-xs xl:text-base w-1/4 font-bold block">
                      Peso Tara
                    </label>
                    <input
                      className="shadow w-3/4 text-base appearance-none border-2 border-[#6D80A6] rounded text-[#182540] leading-tight focus:outline-none focus:ring-2 focus:[#6D80A6]"
                      type="text"
                      id="pesoTara"
                      value={peso.tara}
                      onChange={handlePesoTaraChange}
                    />
                    <button
                      className="text-[#182540] rounded"
                      onClick={handleFetchPesoTara}
                    >
                      <CursorArrowRaysIcon className="w-6" />
                    </button>
                  </div>
                  <InputField
                    label="Fecha Salida"
                    id="fechaSalida"
                    type="date"
                    value={
                      fechaSalida
                        ? fechaSalida
                        : initialData.fSalida || currentDate
                    }
                    onChange={(e) => setFechaSalida(e.target.value)}
                    tabIndex="-1"
                  />
                  <InputField
                    label="Hora Salida"
                    id="horaSalida"
                    type="time"
                    value={
                      horaSalida
                        ? horaSalida
                        : initialData.hSalida || currentTime
                    }
                    onChange={(e) => setHoraSalida(e.target.value)}
                    tabIndex="-1"
                  />
                  <div className="m-0 p-1 flex w-full justify-between">
                    <label className="text-xs xl:text-base w-1/4 font-bold block">
                      Peso Bruto
                    </label>
                    <input
                      className="shadow w-3/4 text-base appearance-none border-2 border-[#6D80A6] rounded text-[#182540] leading-tight focus:outline-none focus:ring-2 focus:[#6D80A6]"
                      type="number"
                      id="pesoBruto"
                      value={
                        isFinalizing || isHistorial || isTiquete
                          ? peso.bruto
                          : ""
                      }
                      onChange={handlePesoBrutoChange}
                    />
                    <button
                      className="text-[#182540] rounded"
                      onClick={handleFetchPesoBruto}
                    >
                      <CursorArrowRaysIcon className="w-6" />
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <div className="m-0 p-1 flex w-full justify-between">
                    <label className="text-xs xl:text-base w-1/4 font-bold block">
                      Peso Bruto
                    </label>
                    <input
                      className="shadow w-3/4 text-base appearance-none border-2 border-[#6D80A6] rounded text-[#182540] leading-tight focus:outline-none focus:ring-2 focus:[#6D80A6]"
                      type="text"
                      id="pesoBruto"
                      value={peso.bruto}
                      onChange={handlePesoBrutoChange}
                    />
                    <button
                      className="text-[#182540] rounded"
                      onClick={handleFetchPesoBruto}
                    >
                      <CursorArrowRaysIcon className="w-6" />
                    </button>
                  </div>

                  <InputField
                    label="Fecha Salida"
                    id="fechaSalida"
                    type="date"
                    value={
                      isFinalizing
                        ? fechaSalida || initialData.fSalida || currentDate
                        : fechaSalida || initialData.fSalida || "" // Valor editable cuando no se está finalizando
                    }
                    onChange={(e) => setFechaSalida(e.target.value)}
                    tabIndex={"0"} // Habilitado para editar
                    disabled={isProcessing}
                  />
                  <InputField
                    label="Hora Salida"
                    id="horaSalida"
                    type="time"
                    value={
                      isFinalizing
                        ? horaSalida || initialData.hSalida || currentTime
                        : horaSalida || initialData.hSalida || "" // Valor editable cuando no se está finalizando
                    }
                    onChange={(e) => setHoraSalida(e.target.value)}
                    tabIndex={"0"} // Habilitado para editar
                    disabled={isProcessing}
                  />

                  <div className="m-0 p-1 flex w-full justify-between">
                    <label className="text-xs xl:text-base w-1/4 font-bold block">
                      Peso Tara
                    </label>
                    <input
                      className="shadow w-3/4 text-base appearance-none border-2 border-[#6D80A6] rounded text-[#182540] leading-tight focus:outline-none focus:ring-2 focus:[#6D80A6]"
                      type="text"
                      id="pesoTara"
                      value={
                        isFinalizing || isHistorial || isTiquete
                          ? peso.tara
                          : ""
                      }
                      onChange={handlePesoTaraChange}
                    />
                    <button
                      className="text-[#182540] rounded"
                      onClick={handleFetchPesoTara}
                    >
                      <CursorArrowRaysIcon className="w-6" />
                    </button>
                  </div>
                </>
              )}
              <div className="p-1 flex  col-end-4">
                <label className="text-xs xl:text-base w-1/4 font-bold block">
                  Peso Neto
                </label>
                <input
                  className="shadow w-[65%] xl:w-[70%] text-base appearance-none border-2 border-[#6D80A6] rounded text-[#182540] leading-tight focus:outline-none focus:ring-2 focus:[#6D80A6]"
                  type="number"
                  id="pesoNeto"
                  value={peso.neto}
                  disabled={isProcessing}
                  readOnly
                />
              </div>
            </div>
          </FormSection>
        </section>

        <section>
          <FormSection title="Observaciones">
            <textarea
              id="observaciones"
              className="col-start-1 col-end-7 appearance-none border-2 border-[#6D80A6] rounded w-full py-1 px-1 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:[#6D80A6]"
              value={observaciones}
              onChange={(e) => setObservaciones(e.target.value)}
            />
          </FormSection>
        </section>
        <section>
          <div className="p-1 flex items-center justify-between text-xs 2xl:text-base">
            <button
              className={`${
                formType
                  ? "bg-[#182540] text-[#f2f2f2]"
                  : "bg-[#f2f2f2] text-[#182540]"
              } font-bold py-2 hover:bg-[#6D80A6] hover:text-[#f2f2f2] px-4 rounded focus:outline-none focus:ring-2 focus:[#6D80A6]`}
              type="button"
              disabled={!formType || isProcessing} // Desactivar el botón si ya se está procesando
              onClick={() => {
                if (isFinalizing || isHistorial || isTiquete) {
                  handleActualizar();
                } else {
                  handleProcesar();
                }
              }}
            >
              {isFinalizing
                ? "Finalizar Tiquete"
                : isHistorial || isTiquete
                ? "Actualizar Tiquete"
                : "Procesar"}
            </button>
            {(isHistorial || isFinalizing || isTiquete) && (
              <button
                className={`${
                  formType
                    ? "bg-[#182540] text-[#f2f2f2]"
                    : "bg-[#f2f2f2] text-[#182540]"
                } font-bold py-2 px-4 rounded hover:bg-[#6D80A6] hover:text-[#f2f2f2] focus:outline-none focus:ring-2 focus:[#6D80A6]`}
                type="button"
                onClick={handleImprimirTiquete} // Asegúrate de llamar a la función correcta
                disabled={isProcessing} // Desactivar el botón si ya se está procesando
              >
                Imprimir
              </button>
            )}
            <div>
              <button
                className="bg-[#182540] hover:bg-[#6D80A6] hover:text-[#f2f2f2] text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:[#6D80A6]"
                onClick={handleSalir}
              >
                Salir
              </button>
              
            </div>
            {showAlertaSalir && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
                  <h2 className="text-lg font-bold text-gray-800 mb-4">
                    ¿Estás seguro?
                  </h2>
                  <p className="text-gray-600 mb-6">
                    Si sales ahora, perderás el consecutivo.
                  </p>
                  <div className="flex justify-end space-x-4">
                    <button
                      onClick={cancelarSalida}
                      className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400"
                    >
                      Cancelar
                    </button>
                    <button
                      onClick={confirmarSalida}
                      className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                    >
                      Sí, salir
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>
      </div>
      <Notification
        message={notification.message}
        type={notification.type}
        onConfirm={() => setNotification({ message: "", type: "" })}
        onCancel={() => setNotification({ message: "", type: "" })}
      />
    </div>
  );
};

export default TiqueteForm;
