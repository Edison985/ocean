import { useState, useEffect, useRef, useMemo } from "react";
import moment from "moment";
import Sidebar from "../components/Layouts/Sidebar";
import Header from "../components/Layouts/Header";
import Table from "../components/Layouts/Tabla";
import { MagnifyingGlassIcon } from "@heroicons/react/24/solid";
import InputField from "../components/Layouts/InputField";
import SelectField from "../components/Layouts/SelectField";
import Notification from "../components/Layouts/Notificacion";
import { useNavigate } from "react-router-dom";
import transformarDatos from "../utils/TransformarDatos";
import transformarDatosProducto from "../utils/TransformarDatosProducto";
import transformarDatosHistorial from "../utils/TransformarDatosHistorial";
import axios from "axios";
const iconExcel = `${process.env.PUBLIC_URL}/assets/excel.svg`;




function Consultas() {
  const [formType, setFormType] = useState("INGRESO");
  const [ingresos, setIngresos] = useState([]);
  const [despachos, setDespachos] = useState([]);
  const [servicios, setServicios] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [proveedores, setProveedores] = useState([]);
  const [terceros, setTerceros] = useState([]);
  const [productos, setProductos] = useState([]);
  const [varios, setVarios] = useState([]);
  const [vehiculos, setVehiculos] = useState([]);
  const [trailers, setTrailers] = useState([]);
  const [conductores, setConductores] = useState([]);
  const [origenes, setOrigenes] = useState([]);
  const [destinos, setDestinos] = useState([]);
  const [patios, setPatios] = useState([]);
  const [compradores, setCompradores] = useState([]);
  const [transportadoras, setTransportadoras] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [procesosProducto, setProcesosProducto] = useState([]);
  const [unidadesMedida, setUnidadesMedida] = useState([]);
  const [historial, setHistorial] = useState([]);
  const cancelTokenSource = useRef(null);
  const navigate = useNavigate();
  const [facturas, setFacturas] = useState([]);


  useEffect(() => {
    const currentDate = moment().format("YYYY-MM-DD");

    if (["INGRESO", "DESPACHO", "SERVICIOS", "HISTORIAL"].includes(formType)) {
      setStartDate(currentDate);
      setEndDate(currentDate);
    } else {
      setStartDate("");
      setEndDate("");
    }
  }, [formType]);

  useEffect(() => {
    if (
      ["INGRESO", "DESPACHO", "SERVICIOS", "HISTORIAL"].includes(formType) &&
      startDate &&
      endDate
    ) {
      fetchData();
    }
  }, [startDate, endDate]);


  const fetchCommonData = async () => {
    const token = sessionStorage.getItem("token");
  
    const headers = {
      Authorization: `Bearer ${token}`,
    };

    try {
      const [
        clientesResponse,
        proveedoresResponse,
        tercerosResponse,
        productosResponse,
        variosResponse,
        destinosResponse,
        origenesResponse,
        patiosResponse,
        compradoresResponse,
        transportadorasResponse,
        conductoresResponse,
        vehiculosResponse,
        trailersResponse,
        facturaResponse,
        unidadResponse,
        historialResponse,
      ] = await Promise.all([
        axios.get("https://ocean-syt-production.up.railway.app/entidad/1", { headers }),
        axios.get("https://ocean-syt-production.up.railway.app/entidad/2", { headers }),
        axios.get("https://ocean-syt-production.up.railway.app/entidad/3", { headers }),
        axios.get("https://ocean-syt-production.up.railway.app/producto/1", { headers }),
        axios.get("https://ocean-syt-production.up.railway.app/producto/2", { headers }),
        axios.get("https://ocean-syt-production.up.railway.app/destino/", { headers }),
        axios.get("https://ocean-syt-production.up.railway.app/origen/", { headers }),
        axios.get("https://ocean-syt-production.up.railway.app/patio/", { headers }),
        axios.get("https://ocean-syt-production.up.railway.app/comprador/", { headers }),
        axios.get("https://ocean-syt-production.up.railway.app/transportadora/", { headers }),
        axios.get("https://ocean-syt-production.up.railway.app/conductor/", { headers }),
        axios.get("https://ocean-syt-production.up.railway.app/vehiculo/", { headers }),
        axios.get("https://ocean-syt-production.up.railway.app/trailer/", { headers }),
        axios.get("https://ocean-syt-production.up.railway.app/factura/", { headers }),
        axios.get("https://ocean-syt-production.up.railway.app/medida/", { headers }),
        axios.get("https://ocean-syt-production.up.railway.app/historial/", { headers }),
      ]);

      // Set data
      setClientes(clientesResponse.data);
      setProveedores(proveedoresResponse.data);
      setTerceros(tercerosResponse.data);
      const dataTransformadaProducto = transformarDatosProducto(productosResponse.data);
      setProductos(dataTransformadaProducto);

      const dataTransformadaVarios = transformarDatosProducto(variosResponse.data);
      setVarios(dataTransformadaVarios);

      setDestinos(destinosResponse.data);
      setOrigenes(origenesResponse.data);
      setPatios(patiosResponse.data);
      setCompradores(compradoresResponse.data);
      setTransportadoras(transportadorasResponse.data);
      setConductores(conductoresResponse.data);
      setVehiculos(vehiculosResponse.data);
      setTrailers(trailersResponse.data);
      setFacturas(facturaResponse.data);
      setUnidadesMedida(unidadResponse.data);
      setHistorial(historialResponse.data);
    } catch (error) {
      console.error("Error fetching common data:", error);
      setErrorMessage("Error fetching common data: " + error.message);
    }
  };


  const fetchData = async () => {
    setLoading(true);

    try {
      const token = sessionStorage.getItem('token');
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      let apiUrl = "";
      let response;

      switch (formType) {
        case "INGRESO":
        case "DESPACHO":
        case "SERVICIOS":
          const tipoMap = {
            INGRESO: 1,
            DESPACHO: 2,
            SERVICIOS: 3,
          };
          const tipoValor = tipoMap[formType];

          const today = moment().format("YYYY-MM-DD");
          const fechaInicio = startDate || today;
          const fechaFin = endDate || today;

          apiUrl = `https://ocean-syt-production.up.railway.app/registro/finalizado/${tipoValor}?fecha_inicio=${fechaInicio}&fecha_fin=${fechaFin}`;

          response = await axios.get(apiUrl, { headers });
          const dataTransformada = transformarDatos(response.data);

          if (formType === "INGRESO") setIngresos(dataTransformada);
          if (formType === "DESPACHO") setDespachos(dataTransformada);
          if (formType === "SERVICIOS") setServicios(dataTransformada);
          

          fetchCommonData();
          break;

        case "CLIENTE":
          apiUrl = `https://ocean-syt-production.up.railway.app/entidad/1`;
          response = await axios.get(apiUrl, { headers });
          setClientes(response.data);
          break;

        case "PROVEEDOR":
          apiUrl = `https://ocean-syt-production.up.railway.app/entidad/2`;
          response = await axios.get(apiUrl, { headers });
          setProveedores(response.data);
          break;

        case "TERCERO":
          apiUrl = `https://ocean-syt-production.up.railway.app/entidad/3`;
          response = await axios.get(apiUrl, { headers });
          setTerceros(response.data);
          break;

        case "PRODUCTO":
          try {
            const url = "https://ocean-syt-production.up.railway.app/producto/1";
            response = await axios.get(url, { headers });
            const dataTransformadaProducto = transformarDatosProducto(response.data);
            setProductos(dataTransformadaProducto);
            fetchProcesosProducto();
            fetchUnidadesMedida();
 
          } catch (error) {
            console.error("Error fetching products data:", error);
          }
          break;

        case "VARIOS":
          apiUrl = "https://ocean-syt-production.up.railway.app/producto/2";
          response = await axios.get(apiUrl, { headers });
          const dataTransformadaVarios = transformarDatosProducto(response.data);
          setVarios(dataTransformadaVarios);

        case "VEHICULO":
          apiUrl = `https://ocean-syt-production.up.railway.app/vehiculo/`;
          response = await axios.get(apiUrl, { headers });
          setVehiculos(response.data);
          break;

        case "CONDUCTOR":
          apiUrl = `https://ocean-syt-production.up.railway.app/conductor/`;
          response = await axios.get(apiUrl, { headers });
          setConductores(response.data);
          break;

        case "ORIGEN":
          apiUrl = "https://ocean-syt-production.up.railway.app/origen/";
          response = await axios.get(apiUrl, { headers });
          setOrigenes(response.data);
          break;

        case "DESTINO":
          apiUrl = "https://ocean-syt-production.up.railway.app/destino/";
          response = await axios.get(apiUrl, { headers });
          setDestinos(response.data);
          break;

        case "PATIO":
          apiUrl = "https://ocean-syt-production.up.railway.app/patio/";
          response = await axios.get(apiUrl, { headers });
          setPatios(response.data);
          break;

        case "COMPRADOR":
          apiUrl = "https://ocean-syt-production.up.railway.app/comprador/";
          response = await axios.get(apiUrl, { headers });
          setCompradores(response.data);
          break;

        case "TRAILER":
          apiUrl = "https://ocean-syt-production.up.railway.app/trailer/";
          response = await axios.get(apiUrl, { headers });
          setTrailers(response.data);
          break;

        case "TRANSPORTADORA":
          apiUrl = "https://ocean-syt-production.up.railway.app/transportadora/";
          response = await axios.get(apiUrl, { headers });
          setTransportadoras(response.data);
          break;

        case "FACTURA":
          apiUrl = "https://ocean-syt-production.up.railway.app/factura/";
          response = await axios.get(apiUrl, { headers });
          setFacturas(response.data);
          break;

        case "MEDIDA":
          apiUrl = "https://ocean-syt-production.up.railway.app/medida/";
          response = await axios.get(apiUrl, { headers });
          setUnidadesMedida(response.data);
          break;

        case "HISTORIAL":
          apiUrl = "https://ocean-syt-production.up.railway.app/historial/";
          response = await axios.get(apiUrl, { headers });
          const dataTransformadaHistorial = transformarDatosHistorial(response.data);
          setHistorial(dataTransformadaHistorial);
          break;

        default:
          break;
      }
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log("Request canceled", error.message);
      } else {
        setErrorMessage("Error fetching data: " + error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchProcesosProducto = async () => {
    try {
      const response = await axios.get(
        "https://ocean-syt-production.up.railway.app/proceso/"
      );
      setProcesosProducto(response.data);
    } catch (error) {
      console.error("Error fetching procesos producto:", error);
    }
  };

  const fetchUnidadesMedida = async () => {
    try {
      const response = await axios.get("https://ocean-syt-production.up.railway.app/medida/");
      setUnidadesMedida(response.data);
    } catch (error) {
      console.error("Error fetching unidades de medida:", error);
    }
  };


  useEffect(() => {
    fetchData();
  }, [formType]);

  const handleExport = async () => {
    let apiUrl = "";

    if (formType === "INGRESO") {
      apiUrl = `/registro/exportar/ingresos?fecha_inicio=${startDate}&fecha_fin=${endDate}&consulta=${encodeURIComponent(searchQuery)}`;
    } else if (formType === "DESPACHO") {
      apiUrl = `/registro/exportar/despachos?fecha_inicio=${startDate}&fecha_fin=${endDate}&consulta=${encodeURIComponent(searchQuery)}`;
    } else if (formType === "SERVICIOS") {
      apiUrl = `/registro/exportar/servicios?fecha_inicio=${startDate}&fecha_fin=${endDate}&consulta=${encodeURIComponent(searchQuery)}`;
    } else if (formType === "HISTORIAL") {
      apiUrl = `/historial/exportar?fecha_inicio=${startDate}&fecha_fin=${endDate}&consulta=${encodeURIComponent(searchQuery)}`;
    } else if (formType === "CLIENTE") {
      apiUrl = `/entidad/exportar/1?consulta=${encodeURIComponent(searchQuery)}`;
    } else if (formType === "PROVEEDOR") {
      apiUrl = `/entidad/exportar/2?consulta=${encodeURIComponent(searchQuery)}`;
    } else if (formType === "TERCERO") {
      apiUrl = `/entidad/exportar/3?consulta=${encodeURIComponent(searchQuery)}`;
    } else if (formType === "PRODUCTO") {
      apiUrl = `/producto/exportar/1?consulta=${encodeURIComponent(searchQuery)}`;
    } else if (formType === "VARIOS") {
      apiUrl = `/producto/exportar/2?consulta=${encodeURIComponent(searchQuery)}`;
    } else if (formType === "VEHICULO") {
      apiUrl = `/vehiculo/exportar?consulta=${encodeURIComponent(searchQuery)}`;
    } else if (formType === "TRAILER") {
      apiUrl = `/trailer/exportar?consulta=${encodeURIComponent(searchQuery)}`;
    } else if (formType === "CONDUCTOR") {
      apiUrl = `/conductor/exportar?consulta=${encodeURIComponent(searchQuery)}`;
    } else if (formType === "TRANSPORTADORA") {
      apiUrl = `/transportadora/exportar?consulta=${encodeURIComponent(searchQuery)}`;
    } else if (formType === "COMPRADOR") {
      apiUrl = `/comprador/exportar?consulta=${encodeURIComponent(searchQuery)}`;
    } else if (formType === "ORIGEN") {
      apiUrl = `/origen/exportar?consulta=${encodeURIComponent(searchQuery)}`;
    } else if (formType === "DESTINO") {
      apiUrl = `/destino/exportar?consulta=${encodeURIComponent(searchQuery)}`;
    } else if (formType === "PATIO") {
      apiUrl = `/patio/exportar?consulta=${encodeURIComponent(searchQuery)}`;
    } else if (formType === "FACTURA") {
      apiUrl = `/factura/exportar?consulta=${encodeURIComponent(searchQuery)}`;
    } else if (formType === "MEDIDA") {
      apiUrl = `/medida/exportar?consulta=${encodeURIComponent(searchQuery)}`;
    }

    if (!apiUrl) return;

    try {
      const token = sessionStorage.getItem("token");

      const response = await axios.get(`https://ocean-syt-production.up.railway.app${apiUrl}`, {
        responseType: 'blob',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const disposition = response.headers['content-disposition'];
      let filename = 'exportacion.xlsx';

      if (disposition) {
        const match = disposition.match(/filename="?([^"]+)"?/);
        if (match && match[1]) {
          filename = match[1];
        }
      }

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Error exportando:', error);
    }
  };

  const handleDoubleClick = (record) => {
    if (["INGRESO", "DESPACHO", "SERVICIOS"].includes(formType)) {
      let formTypeToNavigate;
      if (record.tipo) {
        switch (record.tipo) {
          case "INGRESO":
            formTypeToNavigate = "INGRESO";
            break;
          case "DESPACHO":
            formTypeToNavigate = "DESPACHO";
            break;
          case "SERVICIOS":
            formTypeToNavigate = "SERVICIOS";
            break;
          default:
            formTypeToNavigate = null;
            break;
        }
        if (formTypeToNavigate) {
          navigate("/formulario", {
            state: {
              record,
              formType: formTypeToNavigate,
              isTiquete: true,
            },
          });
        }
      } else {
        console.warn("El tipo de registro es undefined:", record);
      }
    }
  };

  const columnConfig = {
    INGRESO: [
      {name: "registro_id", title: "ID", hidden: true},
      { name: "consecutivo_tiquete", title: "Tiquete"},
      { name: "consecutivo", title: "Registro" },
      { name: "tipo", title: "Tipo" },
      { name: "factura_fecha", title: "Facturado" },
      { name: "origen_nombre", title: "Origen" },
      { name: "fecha_entrada", title: "Fecha Entrada" },
      { name: "hora_entrada", title: "Hora Entrada" },
      { name: "fecha_salida", title: "Fecha Salida" },
      { name: "hora_salida", title: "Hora Salida" },
      { name: "vehiculo_placa", title: "Placa" },
      { name: "trailer_placa", title: "Trailer" },
      { name: "conductor_nombre", title: "Conductor" },
      { name: "conductor_cedula", title: "Cedula Conductor" },
      { name: "entidad_codigo", title: "Código Proveedor" },
      { name: "entidad_nombre", title: "Proveedor" },
      { name: "comprador_codigo", title: "Código Comprador" },
      { name: "comprador_nombre", title: "Comprador" },
      { name: "producto_codigo", title: "Código Producto" },
      { name: "producto_nombre", title: "Producto" },
      { name: "peso_bruto", title: "Peso Entrada" },
      { name: "peso_tara", title: "Peso Salida" },
      { name: "peso_neto", title: "Peso Neto" },
      { name: "patio_nombre", title: "Patio" },
      { name: "observaciones", title: "Observaciones" },
    ],
    DESPACHO: [
      {name: "registro_id", title: "ID", hidden: true},
      { name: "consecutivo_tiquete", title: "Tiquete"},
      { name: "consecutivo", title: "Registro" },
      { name: "tipo", title: "Tipo" },
      { name: "fecha_entrada", title: "Fecha Entrada" },
      { name: "hora_entrada", title: "Hora Entrada" },
      { name: "fecha_salida", title: "Fecha Salida" },
      { name: "hora_salida", title: "Hora Salida" },
      { name: "vehiculo_placa", title: "Placa" },
      { name: "trailer_placa", title: "Trailer" },
      { name: "conductor_nombre", title: "Conductor" },
      { name: "conductor_cedula", title: "Cedula Conductor" },
      { name: "entidad_codigo", title: "Código Cliente" },
      { name: "entidad_nombre", title: "Cliente" },
      { name: "destino_codigo", title: "Código Destino" },
      { name: "destino_nombre", title: "Destino" },
      { name: "producto_codigo", title: "Código Producto" },
      { name: "producto_nombre", title: "Producto" },
      { name: "peso_tara", title: "Peso Entrada" },
      { name: "peso_bruto", title: "Peso Salida" },
      { name: "peso_neto", title: "Peso Neto" },
      { name: "origen_nombre", title: "Origen" },
      { name: "patio_nombre", title: "Patio" },
      { name: "transportadora_nombre", title: "Transportadora" },
      { name: "orden", title: "Orden" },
      { name: "precinto", title: "Precintos" },
      { name: "observaciones", title: "Observaciones" },
    ],
    SERVICIOS: [
      {name: "registro_id", title: "ID", hidden: true},
      { name: "consecutivo_tiquete", title: "Tiquete"},
      { name: "consecutivo", title: "Registro" },
      { name: "tipo", title: "Tipo" },
      { name: "fecha_entrada", title: "Fecha Entrada" },
      { name: "hora_entrada", title: "Hora Entrada" },
      { name: "fecha_salida", title: "Fecha Salida" },
      { name: "hora_salida", title: "Hora Salida" },
      { name: "vehiculo_placa", title: "Placa" },
      { name: "trailer_placa", title: "Trailer" },
      { name: "conductor_nombre", title: "Conductor" },
      { name: "conductor_cedula", title: "Cedula Conductor" },
      { name: "entidad_codigo", title: "Código Tercero" },
      { name: "entidad_nombre", title: "Tercero" },
      { name: "comprador_codigo", title: "Código Comprador" },
      { name: "comprador_nombre", title: "Comprador" },
      { name: "producto_codigo", title: "Código Servicio" },
      { name: "producto_nombre", title: "Servicio" },
      { name: "peso_bruto", title: "Peso Entrada" },
      { name: "peso_tara", title: "Peso Salida" },
      { name: "peso_neto", title: "Peso Neto" },
      { name: "origen_nombre", title: "Origen" },
      { name: "patio_nombre", title: "Patio" },
      { name: "unidad_medida", title: "Unidad" },
      { name: "cantidad", title: "Cantidad" },
      { name: "observaciones", title: "Observaciones" },
    ],
    
    CLIENTE: [
      { name: "ent_id", title: "ID", hidden: true },
      { name: "ent_codigo", title: "CÓDIGO" },
      { name: "ent_nombre", title: "CLIENTE" },
      { name: "ent_nit", title: "NIT" },
      { name: "ent_telefono", title: "TELÉFONO" },
      
    ],
    PROVEEDOR: [
      { name: "ent_id", title: "ID", hidden: true },
      { name: "ent_codigo", title: "CÓDIGO" },
      { name: "ent_nombre", title: "PROVEEDOR" },
      { name: "ent_nit", title: "NIT" },
      { name: "ent_telefono", title: "TELÉFONO" },
      
    ],
    TERCERO: [
      { name: "ent_id", title: "ID", hidden: true },
      { name: "ent_codigo", title: "CÓDIGO" },
      { name: "ent_nombre", title: "TERCERO" },
      { name: "ent_nit", title: "NIT" },
      { name: "ent_telefono", title: "TELÉFONO" },
      
    ],

    PRODUCTO: [
      { name: "prod_id", title: "ID", hidden: true },
      { name: "prod_codigo", title: "CÓDIGO" },
      { name: "prod_nombre", title: "PRODUCTO" },
      { name: "prod_medida", title: "UNIDAD MEDIDA" },
      { name: "prod_proceso", title: "PROCESO PRODUCTO" },
    ],
    VARIOS: [
      { name: "prod_id", title: "ID", hidden: true },
      { name: "prod_codigo", title: "CÓDIGO" },
      { name: "prod_nombre", title: "PRODUCTO" },
      { name: "prod_medida", title: "UNIDAD MEDIDA" },

      
    ],
    VEHICULO: [
      { name: "vehi_id", title: "ID", hidden: true },
      { name: "vehi_placa", title: "Placa" },
    ],
    TRAILER: [
      { name: "tra_id", title: "ID", hidden: true },
      { name: "trai_placa", title: "Trailer" },
    ],
    CONDUCTOR: [
      { name: "conduct_id", title: "ID", hidden: true },
      { name: "conduct_nombre", title: "Conductor" },
      { name: "conduct_cedula", title: "Cedula" },
      { name: "conduct_telefono", title: "Telefono" },
    ],
    ORIGEN: [
      { name: "ori_id", title: "ID", hidden: true },
      { name: "ori_codigo", title: "Codigo" },
      { name: "ori_nombre", title: "Origen" },
    ],
    DESTINO: [
      { name: "dest_id", title: "ID", hidden: true },
      { name: "dest_codigo", title: "Codigo" },
      { name: "dest_nombre", title: "Destino" },
    ],
    PATIO: [
      { name: "pat_id", title: "ID", hidden: true },
      { name: "pat_codigo", title: "Codigo" },
      { name: "pat_nombre", title: "Patio" },
    ],
    COMPRADOR: [
      { name: "comp_id", title: "ID", hidden: true },
      { name: "comp_codigo", title: "Codigo" },
      { name: "comp_nombre", title: "Comprador" },
      { name: "comp_nit", title: "NIT" },
      { name: "comp_telefono", title: "Telefono" },
    ],
    TRANSPORTADORA: [
      { name: "trans_id", title: "ID", hidden: true },
      { name: "trans_codigo", title: "codigo" },
      { name: "trans_nombre", title: "Transportadora" },
      { name: "trans_ciudad", title: "Ciudad" },
      { name: "trans_nit", title: "NIT" },
      { name: "trans_telefono", title: "Telefono" },
      { name: "trans_direccion", title: "Direccion" },
    ],
    FACTURA: [
      { name: "fact_id", title: "ID", hidden: true },
      { name: "fac_fecha", title: "Factura" },
    ],
    MEDIDA: [
      { name: "um_id", title: "ID", hidden: true },
      { name: "um_nombre", title: "Unidad Medida" },
    ],
     HISTORIAL: [
      { name: "historial_id", title: "ID", hidden: true },
      { name: "historial_registroConsecutivo", title: "Registro" },
      { name: "historial_registroTipo", title: "Tipo" },
      { name: "historial_accion", title: "Accion" },
      { name: "historial_fecha", title: "Fecha" },
      { name: "historial_hora", title: "Hora" },
      { name: "historial_usuarioNombre", title: "Usuario" },
      { name: "historial_usuarioRol", title: "Rol" },
      
    ],    
  };

  const formTypes = [
    { value: "", label: "Seleccione" },
    { value: "INGRESO", label: "INGRESOS" },
    { value: "DESPACHO", label: "DESPACHOS" },
    { value: "SERVICIOS", label: "SERVICIOS" },
    { value: "HISTORIAL", label: "HISTORIAL" },
    { value: "CLIENTE", label: "CLIENTES" },
    { value: "PROVEEDOR", label: "PROVEEDORES" },
    { value: "TERCERO", label: "TERCEROS" },
    { value: "PRODUCTO", label: "PRODUCTOS" },
    { value: "VARIOS", label: "VARIOS" },
    { value: "MEDIDA", label: "UNIDADES DE MEDIDA" },
    { value: "VEHICULO", label: "VEHICULOS" },
    { value: "TRAILER", label: "TRAILERS" },
    { value: "CONDUCTOR", label: "CONDUCTORES" },
    { value: "ORIGEN", label: "ORIGENES" },
    { value: "DESTINO", label: "DESTINOS" },
    { value: "PATIO", label: "PATIOS" },
    { value: "COMPRADOR", label: "COMPRADORES" },
    { value: "TRANSPORTADORA", label: "TRANSPORTADORAS" },
    { value: "FACTURA", label: "FACTURAS" },
    
    
  ];

  const columns = columnConfig[formType] || [];
  const visibleColumns = columns.filter((column) => !column.hidden);

  const filteredData = (
    formType === "CLIENTE"
      ? clientes
      : formType === "PROVEEDOR"
      ? proveedores
      : formType === "TERCERO"
      ? terceros
      : formType === "PRODUCTO"
      ? productos
      : formType === "VEHICULO"
      ? vehiculos
      : formType === "CONDUCTOR"
      ? conductores
      : formType === "INGRESO"
      ? ingresos
      : formType === "DESPACHO"
      ? despachos
      : formType === "SERVICIOS"
      ? servicios
      : formType === "TRAILER"
      ? trailers
      : formType === "ORIGEN"
      ? origenes
      : formType === "DESTINO"
      ? destinos
      : formType === "PATIO"
      ? patios
      : formType === "COMPRADOR"
      ? compradores
      : formType === "TRANSPORTADORA"
      ? transportadoras
      : formType === "VARIOS"
      ? varios
      : formType === "FACTURA"
      ? facturas
      : formType === "MEDIDA"
      ? unidadesMedida
      : formType === "HISTORIAL"
      ? historial
      : []
  )
    .filter((item) => {
      if (
        formType === "INGRESO" ||
        formType === "DESPACHO" ||
        formType === "SERVICIOS" 
        
      ) {
        return item.tipo.toUpperCase() === formType.toUpperCase();
      }
      return true;
    })
    .filter((item) => {
      if (searchQuery === "") return true;
      return Object.values(item).some(
        (val) =>
          val &&
          val.toString().toLowerCase().includes(searchQuery.toLowerCase())
      );
    })
   
  const totalPesoNeto = useMemo(() => {
    return filteredData.reduce((total, item) => {
      const peso = parseFloat(item.peso_neto);
      return total + (isNaN(peso) ? 0 : peso);
    }, 0);
  }, [filteredData]);

  const tablesWithAddButton = [
    "CLIENTE",
    "PROVEEDOR",
    "PRODUCTO",
    "VARIOS",
    "TERCERO",
    "VEHICULO",
    "CONDUCTOR",
    "ORIGEN",
    "DESTINO",
    "PATIO",
    "COMPRADOR",
    "TRANSPORTADORA",
    "TRAILER",
    "FACTURA",
    "MEDIDA",
  ];

  const handleFormTypeChange = (selectedOption) => {
    if (cancelTokenSource.current) {
      cancelTokenSource.current.cancel(
        "Operation canceled due to new request."
      );
    }
    setFormType(selectedOption ? selectedOption.value : "");
    console.log(
      "Form Type selected:",
      selectedOption ? selectedOption.value : ""
    );
    setSearchQuery(""); // Reset search query on form type change
    setStartDate(""); // Reset start date
    setEndDate(""); // Reset end date
    setClientes([]);
    setProveedores([]);
    setTerceros([]);
    setProductos([]);
    setVarios([]);
    setVehiculos([]);
    setConductores([]);
    setOrigenes([]);
    setTrailers([]);
    setPatios([]);
    setCompradores([]);
    setTransportadoras([]);
    setFacturas([]);
 
  };

 
  const calcularDiasParaBorrado = () => {
    const hoy = moment();
    const dia30EsteMes = moment().date(30);

    const proximoBorrado = hoy.isAfter(dia30EsteMes)
      ? moment().add(1, "month").date(30)
      : dia30EsteMes;

    const diasFaltantes = proximoBorrado.diff(hoy, "days");

    let color = "bg-green-100 border-green-300 text-green-800";
    if (diasFaltantes <= 7 && diasFaltantes > 3) {
      color = "bg-yellow-100 border-yellow-300 text-yellow-800";
    } else if (diasFaltantes <= 3) {
      color = "bg-red-100 border-red-300 text-red-800";
    }

    return { diasFaltantes, color };
  };


  return (
    <div className="h-screen font-montserrat bg-[#F2F2F2]">
      <Notification message={errorMessage} type="error" />
      <div className="flex h-full">
        <Sidebar />
        <div className="flex flex-col flex-1 w-screen h-dvh overflow-hidden">
          <Header />
          <div className="m-2 p-1 h-screen overflow-auto">
            <div className="m-1 p-1 text-sm xl:text-base">
              <div className="bg-white p-1 rounded-lg space-y-1">
                <div className="flex items-center space-x-1">
                  <SelectField
                    label="Tablas"
                    id="formType"
                    options={formTypes}
                    value={formType}
                    onChange={handleFormTypeChange}
                    className="mr-2"
                  />
                  <div className="flex-grow w-3/5">
                    <div className="relative">
                      <input
                        className="w-full h-6 p-2 rounded-lg border border-gray-300"
                        placeholder="Buscar..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                      <MagnifyingGlassIcon className="w-5 h-5 absolute right-4 top-1/2 transform -translate-y-1/2" />
                    </div>
                  </div>
                </div>
                {["INGRESO", "DESPACHO", "SERVICIOS", "HISTORIAL"].includes(formType) && (
                  <div className="flex items-center space-x-1">
                    <InputField
                      label="Desde"
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                    />
                    <InputField
                      label="Hasta"
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                    />
       
                  </div>
                )}
              </div>
            </div>
            <div className="m-3 h-[73%] overflow-scroll text-xs">
              <Table
                columns={visibleColumns}
                data={filteredData}
                editable={true}
                formType={formType}
                isConsultasPage={true}
                showAddButton={tablesWithAddButton.includes(formType)}
                setClientes={setClientes}
                setProveedores={setProveedores}
                setTerceros={setTerceros}
                setProductos={setProductos}
                setVarios={setVarios}
                setConductores={setConductores}
                setVehiculos={setVehiculos}
                setDestinos={setDestinos}
                setOrigenes={setOrigenes}
                setCompradores={setCompradores}
                setPatios={setPatios}
                setTransportadoras={setTransportadoras}
                setTrailers={setTrailers}
                setFacturas={setFacturas}
                clientes={clientes}
                proveedores={proveedores}
                terceros={terceros}
                productos={productos}
                origenes={origenes}
                destinos={destinos}
                unidadesMedida={unidadesMedida}
                setUnidaMedida={setUnidadesMedida}
                patios={patios}
                varios={varios}
                transportadoras={transportadoras}
                vehiculos={vehiculos}
                trailers={trailers}
                facturas={facturas}
                compradores={compradores}
                conductores={conductores}
                procesosProducto={procesosProducto}
                onDoubleClickRow={handleDoubleClick}
              />
            </div>
            <div className="flex justify-between mt-4">
              <div>
                             
                {formType === "HISTORIAL" && (() => {
                  const { diasFaltantes, color } = calcularDiasParaBorrado();
                  return (
                    <div className={`mt-1 ml-1 px-2 py-[2px] border rounded text-xs ${color}`}>
                      Los datos de historial se borrarán en <strong>{diasFaltantes}</strong> días.
                    </div>
                  );
                })()}
                {/* Se muestran el total de registros y la suma del peso neto */}
                <h3 className="font-semibold max-xl:text-sm text-lg">
                  Resultados: {filteredData.length}
                </h3>
                {["INGRESO", "DESPACHO", "SERVICIOS"].includes(formType) && (
                <h3 className="font-semibold max-xl:text-sm text-lg">
                  Tonelaje: {totalPesoNeto}
                </h3>
                
                )}
                
              </div>
              <div className="flex items-center bg-[#182540] m-1 p-1 xl:w-1/4 text-white text-sm font-semibold rounded hover:bg-[#6D80A6] hover:text-[#f2f2f2] justify-between">
                <span>Exportar</span>
                <div className="flex">
                  <button className="m-1 p-1" onClick={handleExport}>
                    <img src={iconExcel} alt="Icon" className="w-5 h-5" />
                  </button>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Consultas;
