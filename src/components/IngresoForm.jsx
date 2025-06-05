import React, {useState, forwardRef, useImperativeHandle, useEffect,} from "react";
import { useLocation } from "react-router-dom";
import SelectField from "./Layouts/SelectField";
import FormSection from "./FormSection";
import axios from 'axios';

const IngresoForm = forwardRef(({onSubmit, onActualizar, handleImprimirTiquete},ref) => {
  
    const location = useLocation();
    const initialData = location.state ? location.state.record : {};
    
    const [proveedor, setProveedor] = useState({
      proveedor: initialData.entidad_nombre || "",
      codigo: initialData.entidad_codigo || "",
      id: initialData.entidad_id || null,
    });

    const [comprador, setComprador] = useState({
      comprador: initialData.comprador_nombre || "",
      codigo: initialData.comprador_codigo || "",
      id: initialData.comprador_id || null,
    });

    const [producto, setProdcuto] = useState({
      prodcuto: initialData.producto_nombre || "",
      codigo: initialData.producto_codigo || "",
      id: initialData.producto_id || null,
    });

    const [origen, setOrigen] = useState({
      origen: initialData.origen_nombre || "",
      codigo: initialData.origen_codigo || "",
      id: initialData.origen_id || null,
    });

    const [patio, setPatio] = useState({
      patio: initialData.patio_nombre || "",
      codigo: initialData.patio_codigo || "",
      id: initialData.patio_id || null,
    });

    const [proveedorOptions, setProveedorOptions] = useState([]); // Nuevo estado
    const [compradorOptions, setCompradorOptions] = useState([]); // Nuevo estado
    const [productoOptions, setProductoOptions] = useState([]);
    const [origenOptions, setOrigenOptions] = useState([]);
    const [patioOptions, setPatioOptions] = useState([]);

    const [proveedorCodigoOptions, setProveedorCodigoOptions] = useState([]); // Nuevo estado
    const [compradorCodigoOptions, setCompradorCodigoOptions] = useState([]); // Nuevo estado
    const [productoCodigoOptions, setProductoCodigoOptions] = useState([]);
    
  ;
    const [notification, setNotification] = useState({ message: "", type: "" });

    const fetchProveedores = async () => {
      const token = sessionStorage.getItem("token");
      try {
        const response = await axios.get(
          "https://ocean-syt-production.up.railway.app/entidad/2", {
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

    const fetchProveedorCodigo = async () => {
      const token = sessionStorage.getItem("token");
      try {
        const response = await axios.get(
          "https://ocean-syt-production.up.railway.app/entidad/2", {
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

    const fetchcompradores = async () => {
      const token = sessionStorage.getItem("token");
      try {
        const response = await axios.get("https://ocean-syt-production.up.railway.app/comprador/", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        return response.data.map((item) => ({
          value: item.comp_id,
          label: item.comp_nombre,
        }));
      } catch (error) {
        console.error("Error fetching productos:", error);
      }
    };

    const fetchcompradorCodigo = async () => {
      const token = sessionStorage.getItem("token");
      try {
        const response = await axios.get("https://ocean-syt-production.up.railway.app/comprador/", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        return response.data.map((item) => ({
          value: item.comp_id,
          label: item.comp_codigo,
        }));
      } catch (error) {
        console.error("Error fetching productos:", error);
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
        console.error("Error fetching productos:", error);
      }
    };

    const refreshOptions = async () => {
      const nuevoProveedor = await fetchProveedores();
      const nuevoProveedorCodigo = await fetchProveedorCodigo();
      const nuevoComprador = await fetchcompradores();
      const nuevoCompradorCodigo = await fetchcompradorCodigo();
      const nuevoProducto = await fetchProductos();
      const nuevoProductoCodigo = await fetchProductoCodigo();
      const nuevoOrigen = await fetchOrigenes();
      const nuevoPatio = await fetchPatios();
  
      setProveedorOptions(nuevoProveedor);
      setProveedorCodigoOptions(nuevoProveedorCodigo);
      setCompradorOptions(nuevoComprador);
      setCompradorCodigoOptions(nuevoCompradorCodigo);
      setProductoOptions(nuevoProducto);
      setProductoCodigoOptions(nuevoProductoCodigo);
      setOrigenOptions(nuevoOrigen);
      setPatioOptions(nuevoPatio);
  
  
    };

   
    useEffect(() => {
      const fetchOptions = async () => {
        const proveedores = await fetchProveedores();
        const compradores = await fetchcompradores();
        const productos = await fetchProductos();
        const origenes = await fetchOrigenes();
        const patios = await fetchPatios();

        const proveedorCodigo = await fetchProveedorCodigo();
        const compradorCodigo = await fetchcompradorCodigo();
        const productoCodigo = await fetchProductoCodigo();
      

        setProveedorOptions(proveedores);
        setCompradorOptions(compradores);
        setProductoOptions(productos);
        setOrigenOptions(origenes);
        setPatioOptions(patios);

        setProveedorCodigoOptions(proveedorCodigo);
        setCompradorCodigoOptions(compradorCodigo);
        setProductoCodigoOptions(productoCodigo);
        
      };

      fetchOptions();
    }, []);


    const handleProveedorChange = (selectedOption) => {
      if (selectedOption) {
        setProveedor({
          proveedor: selectedOption.label, // la placa
          id: selectedOption.value, // el ID que ya viene en selectedOption
        });
        
      } else {
        setNotification({ message: "Vehículo no encontrado", type: "error" });
      }
    };

    const handleCompradorChange = (selectedOption) => {
      if (selectedOption) {
        setComprador({
          comprador: selectedOption.label, // la placa
          id: selectedOption.value, // el ID que ya viene en selectedOption
        });

       
      } else {
        setNotification({ message: "Vehículo no encontrado", type: "error" });
      }
    };

    const handleProductoChange = (selectedOption) => {
      if (selectedOption) {
        setProdcuto({
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

    const handlePatioChange = (selectedOption) => {
      if (selectedOption) {
        setPatio({
          patio: selectedOption.label, // la placa
          id: selectedOption.value, // el ID que ya viene en selectedOption
        });
      } else {
        setNotification({ message: "Vehículo no encontrado", type: "error" });
      }
    };

    const handleProcesar = () => {

      const data = {
        reg_identidad: proveedor.id,
        reg_idproducto: producto.id,
        reg_idcomprador: comprador.id,
        reg_idpatio: patio.id,
        reg_idorigen: origen.id || null,
      };

      console.log("Datos de ingreso enviados:", data);
      onSubmit(data);
      
    };

    const handleActualizar = async () => {
      const finalizarData = {

 
        reg_idorigen: origen.id,
        reg_ipatio: patio.id,
        reg_idcomprador: comprador.id,
        reg_identidad: proveedor.id,
        reg_idproducto: producto.id,
        
      };

      try {
        const response = await onActualizar(finalizarData);

        if (response && response.data && response.data.registro_id) {
          const registroId = response.data.registro_id;

          // Asignar correctamente los valores de estado
          setProveedor(finalizarData.reg_identidad);
          setComprador(finalizarData.reg_idcomprador);
          setProdcuto(finalizarData.reg_idproducto);
          setPatio(finalizarData.reg_ipatio);
          setOrigen(finalizarData.reg_idorigen);

          // Llamar a la función para imprimir el tiquete con el ID recién creado
          handleImprimirTiquete(registroId);
        } else {
          throw new Error("No se recibió el ID del tiquete en la respuesta.");
        }
      } catch (error) {
        setNotification({
          message:
            "Error al finalizar y guardar el tiquete: " +
            (error.response ? error.response.data.error : error.message),
          type: "error",
        });
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
      reg_identidad: proveedor.id,
      reg_idproducto: producto.id,
      reg_idtipo: initialData.tipo,
    });

    useImperativeHandle(ref, () => ({
      handleProcesar,
      handleActualizar,
      getFormData,
    }));

    return (
      <>
        <section className="grid grid-cols-2">
          <div className="mr-1">
            <FormSection title="Proveedor">
              <SelectField
                label="Nombre"
                id="nombreProveedor"
                options={proveedorOptions}
                value={proveedor.id}
                onChange={handleProveedorChange}
                apiUrl="https://ocean-syt-production.up.railway.app/entidad/"
                fieldType="proveedor"
                showAddNew={true}
                onAfterSave={refreshOptions}
              />

              <SelectField
                label="Código"
                id="codigoProveedor"
                options={proveedorCodigoOptions}
                apiUrl="https://ocean-syt-production.up.railway.app/entidad/"
                fieldType="proveedor"
                showAddNew={true}
                value={proveedor.id}
                onChange={handleProveedorChange}
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
            <div className="grid grid-cols-2 gap-1">
              <SelectField
                label="Origen"
                id="nombreOrigen"
                options={origenOptions}
                value={origen.id}
                onChange={handleOrigenChange}
                apiUrl="https://ocean-syt-production.up.railway.app/origen/"
                fieldType="origen"
                showAddNew={true}
                onAfterSave={refreshOptions}
              />

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
            </div>
          </FormSection>
        </section>
      </>
    );
  }
);

export default IngresoForm;
