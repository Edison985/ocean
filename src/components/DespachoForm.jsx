import React, {useState,forwardRef,useImperativeHandle,useEffect,} from "react";
import { useLocation } from "react-router-dom";
import SelectField from "./Layouts/SelectField";
import FormSection from "./FormSection";

import axios from 'axios';

const DespachoForm = forwardRef(({onSubmit, onActualizar,handleImprimirTiquete,},ref) => {
    const location = useLocation();
    const initialData = location.state ? location.state.record : {};

    const [cliente, setCliente] = useState({
      cliente: initialData.entidad_nombre || "",
      codigo: initialData.entidad_codigo|| "",
      id: initialData.entidad_id || null
    });
    const [transportadora, setTransportadora] = useState({
      transportadora: initialData.transportadora_nombre || "",
      id: initialData.transportadora_id || null 
    });
    const [producto, setProducto] = useState({
      producto: initialData.producto_nombre || "",
      codigo: initialData.producto_codigo || "",
      id: initialData.producto_id || null
    });
    const [origen, setOrigen] = useState({
      origen: initialData.origen_nombre || "",
      id: initialData.origen_id || null
      
    });
    const [destino, setDestino] = useState({
      destino: initialData.destino_nombre || "",
      id: initialData.destino_id || null
    });
    const [patio, setPatio] = useState({
      patio: initialData.patio_nombre || "",
      id: initialData.patio_id || null
    });

    const [orden, setOrden] = useState(initialData.orden || "");
    const [precinto, setPrecinto] = useState(initialData.precinto || "");
    const [notification, setNotification] = useState({ message: "", type: "" });

    const [clienteOptions, setClienteOptions] = useState([]); // Nuevo estado
    const [transportadoraOptions, setTransportadoraOptions] = useState([]); // Nuevo estado
    const [productoOptions, setProductoOptions] = useState([]);
    const [origenOptions, setOrigenOptions] = useState([]);
    const [destinoOptions, setDestinoOptions] = useState([]);
    const [patioOptions, setPatioOptions] = useState([]);

    const [clienteCodigoOptions, setClienteCodigoOptions] = useState([]); // Nuevo estado
    const [productoCodigoOptions, setProductoCodigoOptions] = useState([]);
    const [destinoCodigoOptions, setDestinoCodigoOptions] = useState([]);


    const fetchClientes = async () => {
      const token = sessionStorage.getItem("token");
      try {
        const response = await axios.get(
          "https://ocean-syt-production.up.railway.app/entidad/1", {
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
        console.error("Error fetching productos:", error);
      }
    };

    const fetchClienteCodigo = async () => {
      const token = sessionStorage.getItem("token");
      try {
        const response = await axios.get(
          "https://ocean-syt-production.up.railway.app/entidad/1", {
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
        console.error("Error fetching productos:", error);
      }
    };

    const fetchTransportadoras = async () => {
      const token = sessionStorage.getItem("token");
      try {
        const response = await axios.get(
          "https://ocean-syt-production.up.railway.app/transportadora/", {
            headers: {
              Authorization: `Bearer ${token}`,
          },
          }

        );
        return response.data.map((item) => ({
          value: item.trans_id,
          label: item.trans_nombre,
        }));
      } catch (error) {
        console.error("Error fetching transportadora:", error);
      }
    };

    const fetchProductos = async () => {
      const token = sessionStorage.getItem("token");
      try {
        const response = await axios.get(
          "https://ocean-syt-production.up.railway.app/producto/1", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          }
        );
        return response.data.map((item) => ({
          value: item.prod_id,
          label: item.prod_nombre,
        }));
      } catch (error) {
        console.error("Error fetching productos:", error);
      }
    };

    const fetchProductoCodigo = async () => {
      const token = sessionStorage.getItem("token");
      try {
        const response = await axios.get(
          "https://ocean-syt-production.up.railway.app/producto/1", {
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
        console.error("Error fetching productos:", error);
      }
    };

    const fetchOrigenes = async () => {
      const token = sessionStorage.getItem("token");
      try {
        const response = await axios.get("https://ocean-syt-production.up.railway.app/origen/",{
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
        );
        return response.data.map((item) => ({
          value: item.ori_id,
          label: item.ori_nombre,
        }));
      } catch (error) {
        console.error("Error fetching productos:", error);
      }
    };

    const fetchDestinos = async () => {
      const token = sessionStorage.getItem("token");
      try {
        const response = await axios.get("https://ocean-syt-production.up.railway.app/destino/", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        return response.data.map((item) => ({
          value: item.dest_id,
          label: item.dest_nombre,
        }));
      } catch (error) {
        console.error("Error fetching destinos:", error);
      }
    };

    const fetchDestinoCodigo = async () => {
      const token = sessionStorage.getItem("token");
      try {
        const response = await axios.get("https://ocean-syt-production.up.railway.app/destino/", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        return response.data.map((item) => ({
          value: item.dest_id,
          label: item.dest_codigo,
        }));
      } catch (error) {
        console.error("Error fetching destinos:", error);
      }
    };

    const fetchPatios = async () => {
      const token = sessionStorage.getItem("token");
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

      const nuevoCliente = await fetchClientes();
      const nuevoClienteCodigo = await fetchClienteCodigo();
      const nuevoTransportadora = await fetchTransportadoras();
      const nuevoProducto = await fetchProductos();
      const nuevoProductoCodigo = await fetchProductoCodigo();
      const nuevoOrigen = await fetchOrigenes();
      const nuevoDestino = await fetchDestinos();
      const nuevoDestinoCodigo = await fetchDestinoCodigo();
      const nuevoPatio = await fetchPatios();
  
      setClienteOptions(nuevoCliente);
      setClienteCodigoOptions(nuevoClienteCodigo);
      setTransportadoraOptions(nuevoTransportadora);
      setProductoOptions(nuevoProducto);
      setProductoCodigoOptions(nuevoProductoCodigo);
      setOrigenOptions(nuevoOrigen);
      setDestinoOptions(nuevoDestino);
      setDestinoCodigoOptions(nuevoDestinoCodigo);
      setPatioOptions(nuevoPatio);
  
  
    };

    useEffect(() => {
      const fetchOptions = async () => {
        const clientes = await fetchClientes();
        const transportadoras = await fetchTransportadoras();
        const productos = await fetchProductos();
        const origenes = await fetchOrigenes();
        const destinos = await fetchDestinos();
        const patios = await fetchPatios();

        const clienteCodigo = await fetchClienteCodigo();
        const productoCodigo = await fetchProductoCodigo();
        const destinoCodigo = await fetchDestinoCodigo();

        setClienteOptions(clientes);
        setTransportadoraOptions(transportadoras);
        setProductoOptions(productos);
        setOrigenOptions(origenes);
        setDestinoOptions(destinos);
        setPatioOptions(patios);

        setClienteCodigoOptions(clienteCodigo);
        setProductoCodigoOptions(productoCodigo);
        setDestinoCodigoOptions(destinoCodigo);
      };

      fetchOptions();
    }, []);

    const handleClienteChange = (selectedOption) => {
      if (selectedOption) {
        setCliente({
          cliente: selectedOption.label, // la placa
          id: selectedOption.value, // el ID que ya viene en selectedOption
        });
      } else {
        setNotification({ message: "Cliente no encontrado", type: "error" });
      }
    };

    const handleTransportadoraChange = (selectedOption) => {
      if (selectedOption) {
        setTransportadora({
          transportadora: selectedOption.label, // la placa
          id: selectedOption.value, // el ID que ya viene en selectedOption
        });
      } else {
        setNotification({ message: "Vehículo no encontrado", type: "error" });
      }
    };

    const handleProductoChange = (selectedOption) => {
      if (selectedOption) {
        setProducto({
          prodcuto: selectedOption.label, // la placa
          id: selectedOption.value, // el ID que ya viene en selectedOption
        });
      } else {
        setNotification({ message: "Vehículo no encontrado", type: "error" });
      }
    };

    const handleOrigenChange = (selectedOption) => {
      if (selectedOption) {
        setOrigen({
          origen: selectedOption.label, // la placa
          id: selectedOption.value, // el ID que ya viene en selectedOption
        });
      } else {
        setNotification({ message: "Vehículo no encontrado", type: "error" });
      }
    };

    const handleDestinoChange = (selectedOption) => {
      if (selectedOption) {
        setDestino({
          destino: selectedOption.label, // la placa
          id: selectedOption.value, // el ID que ya viene en selectedOption
        });
      } else {
        setNotification({ message: "Destino no encontrado", type: "error" });
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

    const handleOrdenChange = (e) => {
      setOrden(e.target.value);
    };

    const handlePrecintoChange = (e) => {
      setPrecinto(e.target.value);
    };

    const handleProcesar = () => {
     
      const data = {
        reg_identidad: cliente.id,
        reg_idproducto: producto.id,
        reg_idtransportadora: transportadora.id,
        reg_idpatio: patio.id,
        reg_idorigen: origen.id,
        reg_iddestino: destino.id,
        reg_orden: orden,
        reg_precinto: precinto,

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
        reg_idtransportadora: transportadora.id,
        reg_identidad: cliente.id,
        reg_idproducto: producto.id,
        reg_orden: orden,
        reg_precinto: precinto,
        
      };

      try {
        const response = await onActualizar(finalizarData);

        if (response && response.data && response.data.registro_id) {
          const registroId = response.data.registro_id;

          setCliente(finalizarData.reg_identidad);
          setTransportadora(finalizarData.reg_idtransportadora);
          setProducto(finalizarData.reg_idproducto);
          setPatio(finalizarData.reg_idpatio);
          setOrigen(finalizarData.reg_idorigen);
          setDestino(finalizarData.reg_iddestino);
          setOrden(finalizarData.reg_orden);
          setPrecinto(finalizarData.reg_precinto);

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
      reg_iddestino: destino.id,
      reg_idpatio: patio.id,
      reg_idtransportadora: transportadora.id,
      reg_identidad: cliente.id,
      reg_idproducto: producto.id,
      reg_precinto: precinto,
      reg_orden: orden,
      reg_idtipo: initialData.tipo,
    });

    useImperativeHandle(ref, () => ({
      handleProcesar,
      handleActualizar,
      getFormData,
    }));

    return (
      <>
        <section className="grid grid-cols-8 gap-0">
          <div className="mr-1 col-span-3">
            <FormSection title="Cliente">
              <div>
                <SelectField
                  label="Nombre"
                  id="nombreCliente"
                  options={clienteOptions}
                  value={cliente.id}
                  onChange={handleClienteChange}
                  apiUrl="https://ocean-syt-production.up.railway.app/entidad/"
                  fieldType="cliente"
                  showAddNew={true}
                  onAfterSave={refreshOptions}
                />
                <SelectField
                  label="Código"
                  id="codigoCliente"
                 options={clienteCodigoOptions}
                  value={cliente.id}
                  onChange={handleClienteChange}
                  apiUrl="https://ocean-syt-production.up.railway.app/entidad/"
                  fieldType="cliente"
                  showAddNew={true}
                  onAfterSave={refreshOptions}
                />
              </div>
            </FormSection>
          </div>
          <div className="ml-1 col-span-5">
            <FormSection title="Transportadora">
              <div className="flex">
                <SelectField
                  label="Nombre"
                  id="nombreTransp"
                  options={transportadoraOptions}
                  value={transportadora.id}
                  onChange={handleTransportadoraChange}
                  apiUrl="https://ocean-syt-production.up.railway.app/transportadora/"
                  fieldType="transportadora"
                  showAddNew={true}
                  onAfterSave={refreshOptions}
                />
                <div className="p-1 flex w-11/12">
                  <label className="text-xs 2xl:text-base text-center w-1/3 font-bold m-1 block">
                    Orden
                  </label>
                  <input
                    id="orden"
                    className="border-2 border-[#6D80A6] rounded w-3/4 text-xs 2xl:text-base h-6 px-1 focus:outline-none focus:ring-2 focus:[#6D80A6]"
                    type="text"
                    value={orden}
                    onChange={handleOrdenChange}
                   
                  />
                </div>
              </div>
              <div className="ml-1 p-1 flex w-11/12">
                <label className="text-xs 2xl:text-base w-1/5 font-bold m-1 block">
                  Precintos
                </label>
                <textarea
                  id="precinto"
                  className="border-2 text-xs 2xl:text-base  border-[#6D80A6] rounded w-11/12 h-7 px-1 focus:outline-none focus:ring-2 focus:[#6D80A6]"
                  type="text"
                  value={precinto}
                  onChange={handlePrecintoChange}
                />
              </div>
            </FormSection>
          </div>
        </section>

        <section>
          <FormSection title="Material">
            <div className="grid grid-cols-2 gap-0">
              <div>
                <SelectField
                  label="Origen"
                  id="origenProducto"
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
                  id="codigoProducto"
                 options={productoCodigoOptions}
                  value={producto.id}
                  onChange={handleProductoChange}
                  apiUrl="https://ocean-syt-production.up.railway.app/producto/"
                  fieldType="producto"
                  showAddNew={true}
                  onAfterSave={refreshOptions}
                />

                <SelectField
                  label="Código"
                  id="destinoProducto"
                  options={destinoCodigoOptions}
                  value={destino.id}
                  onChange={handleDestinoChange}
                  apiUrl="https://ocean-syt-production.up.railway.app/destino/"
                  fieldType="destino"
                  showAddNew={true}
                  onAfterSave={refreshOptions}
                />
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
                  label="Producto"
                  id="nombreProducto"
                  options={productoOptions}
                  value={producto.id}
                  onChange={handleProductoChange}
                  apiUrl="https://ocean-syt-production.up.railway.app/producto/"
                  fieldType="producto"
                  showAddNew={true}
                  onAfterSave={refreshOptions}
                />

                <SelectField
                  label="Destino"
                  id="destinoProducto"
                  options={destinoOptions}
                  value={destino.id}
                  onChange={handleDestinoChange}
                  apiUrl="https://ocean-syt-production.up.railway.app/destino/"
                  fieldType="destino"
                  showAddNew={true}
                  onAfterSave={refreshOptions}
                />
              </div>
            </div>
          </FormSection>
        </section>
      </>
    );
  }
);

export default DespachoForm;
