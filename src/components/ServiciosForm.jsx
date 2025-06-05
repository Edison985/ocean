import React, { useState, useEffect, forwardRef, useImperativeHandle } from "react";
import { useLocation } from "react-router-dom";
import SelectField from "./Layouts/SelectField";
import FormSection from "./FormSection";
import axios from 'axios';

const ServiciosForm = forwardRef(({ onSubmit, onActualizar, handleImprimirTiquete }, ref) => {
  const location = useLocation();
  const initialData = location.state ? location.state.record : {};

  const [tercero, setTercero] = useState({
    tercero: initialData.entidad_nombre || "",
    codigo: initialData.entidad_codigo || "",
    id: initialData.entidad_id || null
  });
  const [comprador, setComprador] = useState({
    comprador: initialData.comprador_nombre || "",
    codigo: initialData.comprador_codigo || "",
    id: initialData.comprador_id || null
  });
  const [servicio, setServicio] = useState({
    servicio: initialData.producto_nombre || "",
    codigo: initialData.producto_codigo || "",
    id: initialData.producto_id || null
  });
  const [origen, setOrigen] = useState({
    origen: initialData.origen_nombre || "",
    id: initialData.origen_id || null
  });
  const [patio, setPatio] = useState({
    patio: initialData.patio_nombre || "",
    id: initialData.patio_id || null
  });
  const [productosData, setProductosData] = useState([]);
  const [cantidad, setCantidad] = useState(initialData.cantidad || "");
  const [unidad, setUnidad] = useState(initialData.unidad_medida || "");
  const [notification, setNotification] = useState({ message: "", type: "" });

  const [terceroOptions, setTerceroOptions] = useState([]); // Nuevo estado
  const [compradorOptions, setCompradorOptions] = useState([]); // Nuevo estado
  const [servicioOptions, setServicioOptions] = useState([]);
  const [origenOptions, setOrigenOptions] = useState([]);
  const [patioOptions, setPatioOptions] = useState([]);
  const [unidadOptions, setUnidadOptions] = useState([]);
  
  const [terceroCodigoOptions, setTerceroCodigoOptions] = useState([]); // Nuevo estado
  const [compradorCodigoOptions, setCompradorCodigoOptions] = useState([]);
  const [servicioCodigoOptions, setServicioCodigoOptions] = useState([]);

  
  const fetchTerceros = async () => {
    let token = sessionStorage.getItem('token');
    try {
      const response = await axios.get(
        "https://ocean-syt-production.up.railway.app/entidad/3", {
        headers: {
            Authorization: `Bearer ${token}`,
        },
        }
      );
      return response.data.map((item) => ({
        value: item.ent_id,
        label: item.ent_nombre,
      }));
    } catch (error) {
      console.error("Error fetching terceros:", error);
    }
  };

  const fetchTerceroCodigo = async () => {
    let token = sessionStorage.getItem('token');
    try {
      const response = await axios.get(
        "https://ocean-syt-production.up.railway.app/entidad/3", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data.map((item) => ({
        value: item.ent_id,
        label: item.ent_codigo,
      }));
    } catch (error) {
      console.error("Error fetching tercero:", error);
    }
  };

  const fetchCompradores = async () => {
    let token = sessionStorage.getItem('token');
    try {
      const response = await axios.get(
        "https://ocean-syt-production.up.railway.app/comprador/", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data.map((item) => ({
        value: item.comp_id,
        label: item.comp_nombre,
      }));
    } catch (error) {
      console.error("Error fetching comprador:", error);
    }
  };

  const fetchCompradorCodigo = async () => {
    let token = sessionStorage.getItem('token');
    try {
      const response = await axios.get(
        "https://ocean-syt-production.up.railway.app/comprador/", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data.map((item) => ({
        value: item.comp_id,
        label: item.comp_codigo,
      }));
    } catch (error) {
      console.error("Error fetching comprador:", error);
    }
  };

  const fetchServicios = async () => {
    let token = sessionStorage.getItem('token');
    try {
      const response = await axios.get(
        "https://ocean-syt-production.up.railway.app/producto/2", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setProductosData(response.data)
  
      return response.data.map((item) => ({
        value: item.prod_id,
        label: item.prod_nombre,
        
      }));
    } catch (error) {
      console.error("Error fetching servicios:", error);
    }
  };

  const fetchServicioCodigo = async () => {
    let token = sessionStorage.getItem('token');
    try {
      const response = await axios.get(
        "https://ocean-syt-production.up.railway.app/producto/2", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      return response.data.map((item) => ({
        value: item.prod_id,
        label: item.prod_codigo,
        
      }));
    } catch (error) {
      console.error("Error fetching servicios:", error);
    }
  };

  const fetchOrigenes = async () => {
    let token = sessionStorage.getItem('token');
    try {
      const response = await axios.get("https://ocean-syt-production.up.railway.app/origen/", {
         headers: {
            Authorization: `Bearer ${token}`,
          },
      });
      return response.data.map((item) => ({
        value: item.ori_id,
        label: item.ori_nombre,
      }));
    } catch (error) {
      console.error("Error fetching productos:", error);
    }
  };

  const fetchPatios = async () => {
     let token = sessionStorage.getItem('token');
    try {
      const response = await axios.get("https://ocean-syt-production.up.railway.app/patio/", {
         headers: {
            Authorization: `Bearer ${token}`,
          },
      });
      return response.data.map((item) => ({
        value: item.pat_id,
        label: item.pat_nombre,
      }));
    } catch (error) {
      console.error("Error fetching patios:", error);
    }
  };

  const refreshOptions = async () => {
    const nuevoTercero = await fetchTerceros();
    const nuevoTerceroCodigo = await fetchTerceroCodigo();
    const nuevoComprador = await fetchCompradores();
    const nuevoCompradorCodigo = await fetchCompradorCodigo();
    const nuevoServicio = await fetchServicios();
    const nuevoServicioCodigo = await fetchServicioCodigo();
    const nuevoOrigen = await fetchOrigenes();
    const nuevoPatio = await fetchPatios();

    setTerceroOptions(nuevoTercero);
    setTerceroCodigoOptions(nuevoTerceroCodigo);
    setCompradorOptions(nuevoComprador);
    setCompradorCodigoOptions(nuevoCompradorCodigo);
    setServicioOptions(nuevoServicio);
    setServicioCodigoOptions(nuevoServicioCodigo);
    setOrigenOptions(nuevoOrigen);
    setPatioOptions(nuevoPatio);


  };

  useEffect(() => {
    const fetchOptions = async () => {
      const terceros = await fetchTerceros();
      const compradores = await fetchCompradores();
      const servicios = await fetchServicios();
      const origenes = await fetchOrigenes();
      const patios = await fetchPatios();
     

      const terceroCodigo = await fetchTerceroCodigo();
      const compradorCodigo = await fetchCompradorCodigo();
      const servicioCodigo = await fetchServicioCodigo();
      

      setTerceroOptions(terceros);
      setCompradorOptions(compradores);
      setServicioOptions(servicios);
      setOrigenOptions(origenes);
      setPatioOptions(patios);
      

      setTerceroCodigoOptions(terceroCodigo);
      setCompradorCodigoOptions(compradorCodigo);
      setServicioCodigoOptions(servicioCodigo);
      
    };

    fetchOptions();
  }, []);

  const handleTerceroChange = (selectedOption) => {
    if (selectedOption) {
      setTercero({
        tercero: selectedOption.label, // la placa
        id: selectedOption.value, // el ID que ya viene en selectedOption
      });
    } else {
      setNotification({ message: "Tercero no encontrado", type: "error" });
    }
  };

  const handleCompradorChange = (selectedOption) => {
    if (selectedOption) {
      setComprador({
        comprador: selectedOption.label, // la placa
        id: selectedOption.value, // el ID que ya viene en selectedOption
      });
    } else {
      setNotification({ message: "Comprador no encontrado", type: "error" });
    }
  };

  const handleServicioChange = (selectedOption) => {

    const productoSeleccionado = productosData.find(
      (item) => item.prod_id === selectedOption.value
    );

    if (productoSeleccionado) {
      setServicio({
        servicio: selectedOption.label, 
        id: selectedOption.value,
      });
      setUnidad(productoSeleccionado.unidad_medida?.um_nombre || "")
      
    } else {
      setNotification({ message: "Origen no encontrado", type: "error" });
    }
  };
  
  const handleOrigenChange = (selectedOption) => {
    if (selectedOption) {
      setOrigen({
        origen: selectedOption.label, // la placa
        id: selectedOption.value, // el ID que ya viene en selectedOption
      });
    } else {
      setNotification({ message: "Origen no encontrado", type: "error" });
    }
  };

  const handlePatioChange = (selectedOption) => {
    if (selectedOption) {
      setPatio({
        patio: selectedOption.label, // la placa
        id: selectedOption.value, // el ID que ya viene en selectedOption
      });
    } else {
      setNotification({ message: "Patio no encontrado", type: "error" });
    }
  };


  const handleProcesar = () => {
    
    const data = {
        reg_identidad: tercero.id,
        reg_idproducto: servicio.id,
        reg_idcomprador: comprador.id,
        reg_idpatio: patio.id,
        reg_idorigen: origen.id,
        reg_cantidad: cantidad
       
    };

    onSubmit(data);

  };


  const handleActualizar = async () => {
    const finalizarData = {
      reg_fechaentrada: initialData.fecha_entrada,
      reg_horaentrada: initialData.hora_entrada,
      reg_fechasalida: new Date().toISOString().slice(0, 10),
      reg_horasalida: new Date().toTimeString().slice(0, 8),
      reg_idorigen: origen.id,
      reg_idpatio: patio.id,
      reg_idcomprador: comprador.id,
      reg_identidad: tercero.id,
      reg_idproducto: servicio.id,
      reg_cantidad: cantidad,

     
    };

    try {
      const response = await onActualizar(finalizarData);

      if (response && response.data && response.data.registro_id) {
        const registroId = response.data.registro_id;

        setTercero(finalizarData.reg_identidad);
        setComprador(finalizarData.reg_idcomprador);
        setServicio(finalizarData.reg_idproducto);
        setPatio(finalizarData.reg_idpatio);
        setOrigen(finalizarData.reg_idorigen);
        setCantidad(finalizarData.reg_cantidad);


        // Llamar a la función para imprimir el tiquete con el ID recién creado
        handleImprimirTiquete(registroId);
      } else {
        throw new Error("No se recibió el ID del registro en la respuesta.");
      }
    } catch (error) {
      setNotification({ message: "Error al finalizar y guardar el tiquete: " + (error.response ? error.response.data.error : error.message), type: "error" });
    }
  };

  const getFormData = () => ({
    reg_fechaentrada: initialData.fecha_entrada,
    reg_horaentrada: initialData.hora_entrada,
    reg_fechasalida: new Date().toISOString().slice(0, 10),
    reg_horasalida: new Date().toTimeString().slice(0, 8),
    reg_idorigen: origen.id,
    reg_idpatio: patio.id,
    reg_idcomprador: comprador.id,
    reg_identidad: tercero.id,
    reg_idproducto: servicio.id,
    reg_cantidad: cantidad,
    reg_idtipo: initialData.tipo
  });

  useImperativeHandle(ref, () => ({
    handleProcesar,
    handleActualizar,
    getFormData
  }));

  return (
    <>
      <section className="grid grid-cols-2">
        <div className="mr-1">
          <FormSection title="Tercero">
            <SelectField
              label="Nombre"
              id="nombreTercero"
              options={terceroOptions}         
              value={tercero.id}
              onChange={handleTerceroChange}
              apiUrl="https://ocean-syt-production.up.railway.app/entidad/"
              fieldType="tercero"
              showAddNew={true}
              onAfterSave={refreshOptions}
            />
            <SelectField
              label="Código"
              id="codigoTercero"
              options={terceroCodigoOptions}          
              value={tercero.id}
              onChange={handleTerceroChange}
              apiUrl="https://ocean-syt-production.up.railway.app/entidad/"
              fieldType="tercero"
              showAddNew={true}
              onAfterSave={refreshOptions}
            />

          </FormSection>
        </div>
        <div className="ml-1">
          <FormSection title="Comprador">
            <SelectField
              label="Nombre"
              id="nombreComprador"
              options={compradorOptions}            
              value={comprador.id}
              onChange={handleCompradorChange}
              apiUrl="https://ocean-syt-production.up.railway.app/comprador/"
              fieldType="comprador"
              showAddNew={true}
              onAfterSave={refreshOptions}
            />
            <SelectField
              label="Código"
              id="codigoComprador"
              options={compradorCodigoOptions}          
              value={comprador.id}
              onChange={handleCompradorChange}
              apiUrl="https://ocean-syt-production.up.railway.app/comprador/"
              fieldType="comprador"
              showAddNew={true}
              onAfterSave={refreshOptions}
            />
          </FormSection>
        </div>
      </section>
      <section>
        <FormSection title="Material">
          <div className="grid grid-cols-2">
            <div>
              <SelectField
                label="Origen"
                id="destinoProducto"
                labelClassName="text-red-700 font-bold"
                options={origenOptions}            
                value={origen.id}
                onChange={handleOrigenChange}
                apiUrl="https://ocean-syt-production.up.railway.app/origen/"
                fieldType="origen"
                showAddNew={true}
          
                onAfterSave={refreshOptions}
              />

              <SelectField
                label="Código"
                id="codigoServicio"
                options={servicioCodigoOptions}             
                value={servicio.id}
                onChange={handleServicioChange}
                apiUrl="https://ocean-syt-production.up.railway.app/producto/"
                fieldType="varios"
                showAddNew={true}
                onAfterSave={refreshOptions}
              />
              <div className="m-0 p-1 flex w-full">
                <label className="text-xs 2xl:text-base w-1/4 font-bold m-1 block mr-1">
                  Unidad
                </label>
                <input
                  id="unidad"
                  className="shadow w-11/12 text-xs 2xl:text-base appearance-none border-2 border-[#6D80A6] rounded px-1 text-[#182540] leading-tight focus:outline-none focus:ring-2 focus:[#6D80A6]"
                  type="text"
                  value={unidad}
                  readOnly
                />
              </div>


            </div>
            <div>
              <SelectField
                label="Patio"
                id="nombrePatio"
                options={patioOptions}             
                value={patio.id}
                onChange={handlePatioChange}
                apiUrl="https://ocean-syt-production.up.railway.app/patio/"
                fieldType="patio"
                showAddNew={true}
                onAfterSave={refreshOptions}
              />
              <SelectField
              label="Nombre"
              id="nombreServicio"
              options={servicioOptions}           
              value={servicio.id}
              onChange={handleServicioChange}
              apiUrl="https://ocean-syt-production.up.railway.app/producto/"
              fieldType="varios"
              showAddNew={true}
              
              onAfterSave={refreshOptions}
              />
              <div className="m-0 p-1 flex w-full">
                <label className="text-xs 2xl:text-base w-1/4 font-bold m-1 block mr-1">
                  Cantidad
                </label>
                <input
                  id="cantidad"
                  className="shadow w-11/12 text-xs 2xl:text-base appearance-none border-2 border-[#6D80A6] rounded px-1 text-[#182540] leading-tight focus:outline-none focus:ring-2 focus:[#6D80A6]"
                  type="text"
                  value={cantidad}
                  onChange={(e) => setCantidad(e.target.value)}
                />
              </div>
            </div>
          </div>
        </FormSection>
      </section>
    </>
  );
});

export default ServiciosForm;
