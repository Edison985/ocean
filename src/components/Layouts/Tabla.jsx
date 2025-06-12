import { useEffect, useState } from "react";
import Notification from "../Layouts/Notificacion";
import "react-datepicker/dist/react-datepicker.css";
import moment from "moment-timezone";
import ModalConfirmacion from "../ModalConfirmacion";
import axios from 'axios'; 


const Table = ({columns,data,editable,onDoubleClickRow,showAddButton,formType,setClientes,setProveedores,
  setTerceros,setProductos,setVarios,setConductores,setVehiculos,setOrigenes,setDestinos,setCompradores,setTransportadoras, setUnidaMedida,
  setPatios,setTrailers,setFacturas,clientes = [],proveedores = [],terceros = [],productos = [],varios = [],vehiculos = [],
  conductores = [],unidadesMedida = [],procesosProducto = [],patios = [],origenes = [],destinos = [],compradores = [],transportadoras = [],productosEntrada = [],
  productosEntradaSalida = [],productosSalida = [],trailers = [],facturas = [], medidas = [],
}) => {
  const [tableData, setTableData] = useState([]);
  const [editingCell, setEditingCell] = useState(null);
  const [editedValue, setEditedValue] = useState("");
  const [newRow, setNewRow] = useState({});
  const [isAddingNewRow, setIsAddingNewRow] = useState(false);
  const [notification, setNotification] = useState({message: "",type: "",onConfirm: null,onCancel: null});
  const [contextMenu, setContextMenu] = useState({show: false,x: 0,y: 0,rowIndex: null});
  const [confirmDelete, setConfirmDelete] = useState({show: false,rowIndex: null,});

  // Reset relevant states when formType changes
  useEffect(() => {
    setContextMenu({ show: false, x: 0, y: 0, rowIndex: null });
    setEditingCell(null);
    setEditedValue("");
    setNewRow({});
  }, [formType])

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (typeof data === "function") {
          const result = await data();
          setTableData(result);
        } else {
          setTableData(data);
        }
      } catch (error) {
        setNotification({ message: "Error fetching data", type: "error" });
      }
    };

    fetchData();
  }, [data]);

  const handleDoubleClick = (rowIndex, columnName, currentValue) => {
    if (editable) {
      setEditingCell({ rowIndex, columnName });
      setEditedValue(currentValue);
    }
  };

  const handleEditCellChange = (e) => {
    setEditedValue(e.target.value);
  };

  const handleEditCellBlur = async () => {
    if (editingCell && !isAddingNewRow) {
      const { rowIndex, columnName } = editingCell;
      const updatedData = [...tableData];
      let editedValueToSend = editedValue;

      // Formatear fechas y horas si corresponde
      if (columnName === "fecha_entrada" || columnName === "fecha_salida") {
        editedValueToSend = moment(editedValue)
          .tz("America/Bogota")
          .format("YYYY-MM-DD");
      } else if (columnName === "hora_entrada" ||columnName === "hora_salida") {
        editedValueToSend = moment(editedValue, "HH:mm")
          .tz("America/Bogota")
          .format("HH:mm");
      }
      updatedData[rowIndex] = {
        ...updatedData[rowIndex],
        [columnName]: editedValue,
      };
      setTableData(updatedData);
      setEditingCell(null);

      try {
        const entity = updatedData[rowIndex];
        let endpoint = "";
        let dataToSend = {};
        let selectedPatioId = null;
        let selectedOrigenId = null;
        let selectedFacturaId = null;
        let selectedTransportadoraId = null;

        if (
          formType === "CLIENTE" ||
          formType === "PROVEEDOR" ||
          formType === "TERCERO"
        ) {
          endpoint = `https://ocean-syt-production.up.railway.app/entidad/${entity.ent_id}`;
          dataToSend = {
            ent_codigo: entity.ent_codigo,
            ent_nombre: entity.ent_nombre,
            ent_telefono: entity.ent_telefono,
            ent_nit: entity.ent_nit,
          };
        } else if (formType === "PRODUCTO" || formType === "VARIOS") {
          endpoint = `https://ocean-syt-production.up.railway.app/producto/${entity.prod_id}`;

          const selectedUnidadMedida = unidadesMedida.find(
            (u) => u.um_nombre === entity.prod_medida || u.um_id == entity.prod_medida
          );
          const selectedProcesoProducto = procesosProducto.find(
            (p) => p.pp_nombre === entity.prod_proceso || p.pp_id == entity.prod_proceso
          );
        
          // Actualizar la entidad con los nombres (solo para mostrar en frontend)
          if (selectedUnidadMedida) entity.prod_medida = selectedUnidadMedida.um_nombre;
          if (selectedProcesoProducto) entity.prod_proceso = selectedProcesoProducto.pp_nombre;
        
          dataToSend = {
            prod_codigo: entity.prod_codigo,
            prod_nombre: entity.prod_nombre,
            prod_idunidadmedida: parseInt(selectedUnidadMedida?.um_id || entity.prod_medida),
            prod_idprocesoproducto: parseInt(selectedProcesoProducto?.pp_id || entity.prod_proceso),
          };
          
          
        } else if (formType === "VEHICULO") {
          endpoint = `https://ocean-syt-production.up.railway.app/vehiculo/${entity.vehi_id}`;
          dataToSend = {
            vehi_placa: entity.vehi_placa,
          };
        } else if (formType === "TRAILER") {
          endpoint = `https://ocean-syt-production.up.railway.app/trailer/${entity.trai_id}`;
          dataToSend = {
            trai_placa: entity.trai_placa,
          };
        } else if (formType === "CONDUCTOR") {
          endpoint = `https://ocean-syt-production.up.railway.app/conductor/${entity.conduct_id}`;
          dataToSend = {
            conduct_codigo: entity.conduct_codigo,
            conduct_nombre: entity.conduct_nombre,
            conduct_cedula: entity.conduct_cedula,
            conduct_telefono: entity.conduct_telefono,
          };
        } else if (formType === "ORIGEN") {
          endpoint = `https://ocean-syt-production.up.railway.app/origen/${entity.ori_id}`;
          dataToSend = {
            ori_codigo: entity.ori_codigo,
            ori_nombre: entity.ori_nombre,
          };
        } else if (formType === "COMPRADOR") {
          endpoint = `https://ocean-syt-production.up.railway.app/comprador/${entity.comp_id}`;
          dataToSend = {
            comp_codigo: entity.comp_codigo,
            comp_nombre: entity.comp_nombre,
            comp_nit: entity.comp_nit,
            comp_telefeono: entity.comp_telefeono,
          };
        } else if (formType === "FACTURA") {
          endpoint = `https://ocean-syt-production.up.railway.app/factura/${entity.fac_id}`;
          dataToSend = {
            fac_fecha: entity.fac_fecha,
          };
        } else if (formType === "MEDIDA") {
          endpoint = `https://ocean-syt-production.up.railway.app/medida/${entity.um_id}`;
          dataToSend = {
            um_nombre: entity.um_nombre,
          };
        } else if (formType === "TRANSPORTADORA") {
          endpoint = `https://ocean-syt-production.up.railway.app/transportadora/${entity.trans_id}`;
          dataToSend = {
            trans_codigo: entity.trans_codigo,
            trans_nombre: entity.trans_nombre,
            trans_ciudad: entity.trans_ciudad,
            trans_telefono: entity.trans_telefono,
            trans_direccion: entity.trans_direccion,
          };
        } else if (formType === "DESTINO") {
          endpoint = `https://ocean-syt-production.up.railway.app/destino/${entity.dest_id}`;
          dataToSend = {
            dest_codigo: entity.dest_codigo,
            dest_nombre: entity.dest_nombre,
          };
        } else if (formType === "PATIO") {
          endpoint = `https://ocean-syt-production.up.railway.app/patio/${entity.pat_id}`;
          dataToSend = {
            pat_codigo: entity.pat_codigo,
            pat_nombre: entity.pat_nombre,
          };
        } else if (
          formType === "INGRESO" ||
          formType === "DESPACHO" ||
          formType === "SERVICIOS"
        ) {
          const entityMapping = {
            INGRESO: proveedores,
            DESPACHO: clientes,
            SERVICIOS: terceros,
          };
          const productMapping = {
            INGRESO: [...productosEntrada, ...productosEntradaSalida],
            DESPACHO: [...productosSalida, ...productosEntradaSalida],
            SERVICIOS: varios,
          };
          const entityArray = entityMapping[formType];
          const productArray = productMapping[formType];

          if (columnName === "peso_bruto" || columnName === "peso_tara") {
            const peso_bruto =
              columnName === "peso_bruto"
                ? parseInt(editedValue)
                : parseInt(entity.peso_bruto);
            const peso_tara =
              columnName === "peso_tara"
                ? parseInt(editedValue)
                : parseInt(entity.peso_tara);

            const peso_neto = parseInt(peso_bruto) - parseInt(peso_tara);
            dataToSend.reg_pesobruto = parseInt(peso_bruto);
            dataToSend.reg_pesotara = parseInt(peso_tara);
            entity.peso_neto = peso_neto;
            dataToSend.reg_pesoneto = peso_neto;
          }

          if (
            columnName === "entidad_nombre" ||
            columnName === "entidad_codigo"
          ) {
            // Find the selected entity either by name or code
            const selectedEntity = entityArray.find(
              (entity) =>
                entity.ent_nombre === editedValue ||
                entity.ent_codigo === editedValue
            );
            if (selectedEntity) {
              dataToSend.reg_identidad = selectedEntity.ent_id;
            }
          } else if (
            columnName === "comprador_nombre" ||
            columnName === "comprador_codigo"
          ) {
            const selectedComprador = compradores.find(
              (comp) =>
                comp.comp_nombre === editedValue ||
                comp.comp_codigo === editedValue
            );
            if (selectedComprador) {
              dataToSend.reg_idcomprador = selectedComprador.comp_id;
            }
          } else if (
            columnName === "producto_nombre" ||
            columnName === "producto_codigo"
          ) {
            const selectedProducto = productArray.find(
              (prod) =>
                prod.prod_nombre === editedValue ||
                prod.prod_codigo === editedValue
            );
            if (selectedProducto) {
              dataToSend.reg_idproducto = selectedProducto.prod_id;
            }
          } else if (
            columnName === "destino_nombre" ||
            columnName === "destino_codigo"
          ) {
            const selectedDestino = destinos.find(
              (dest) =>
                dest.dest_nombre === editedValue ||
                dest.dest_codigo === editedValue
            );
            if (selectedDestino) {
              dataToSend.reg_iddestino = selectedDestino.dest_id;
            }
          } else if (columnName === "patio_nombre") {
            selectedPatioId = patios.find(
              (pat) => pat.pat_nombre === editedValue
            );
            dataToSend.reg_idpatio = selectedPatioId.pat_id;
          } else if (columnName === "factura_fecha") {
            selectedFacturaId = facturas.find(
              (fac) => fac.fac_fecha === editedValue
            );
            dataToSend.reg_idfactura = selectedFacturaId.fac_id;
          } else if (columnName === "origen_nombre") {
            selectedOrigenId = origenes.find(
              (ori) => ori.ori_nombre === editedValue
            );
            dataToSend.reg_idorigen = selectedOrigenId.ori_id;
          } else if (columnName === "transportadora_nombre") {
            selectedTransportadoraId = transportadoras.find(
              (trans) => trans.trans_nombre === editedValue
            );
            dataToSend.reg_idtransportadora = selectedTransportadoraId.trans_id;
          } else if (columnName === "orden") {
            dataToSend.reg_orden = editedValue;
          } else if (columnName === "precinto") {
            dataToSend.reg_precinto = editedValue;
          } else if (columnName === "cantidad") {
            dataToSend.reg_cantidad = editedValue;
          } else if (columnName === "fecha_entrada") {
            dataToSend.reg_fechaentrada = editedValue;
          } else if (columnName === "hora_entrada") {
            dataToSend.reg_horaentrada = editedValue;
          } else if (columnName === "fecha_salida") {
            dataToSend.reg_fechasalida = editedValue;
          } else if (columnName === "hora_salida") {
            dataToSend.reg_horasalida = editedValue;
          } else if (columnName === "vehiculo_placa") {
            const selectedVehiculo = vehiculos.find(
              (vehiculo) => vehiculo.vehi_placa === editedValue
            );
            if (selectedVehiculo) {
              dataToSend.reg_idvehiculo = selectedVehiculo.vehi_id;
            }
          } else if (columnName === "trailer_placa") {
            const selectedTrailer = trailers.find(
              (trailer) => trailer.trai_placa === editedValue
            );
            if (selectedTrailer) {
              dataToSend.reg_idtrailer = selectedTrailer.trai_id;
            }
          } else if (columnName === "conductor_nombre") {
            const selectedConductor = conductores.find(
              (conductor) => conductor.conduct_nombre === editedValue
            );
            if (selectedConductor) {
              dataToSend.reg_idconductor = selectedConductor.conduct_id;
            }
          } else if (columnName === "observaciones") {
            dataToSend.reg_observaciones = editedValue;
          }

          endpoint = `https://ocean-syt-production.up.railway.app/registro/${entity.registro_id}`
        }

        if (endpoint) {
          const token = sessionStorage.getItem("token");
          await axios.put(endpoint, dataToSend, {
            headers: {
              Authorization: `Bearer ${token}`,
            },

          });
          setNotification({
            message: "Registro actualizado con éxito",
            type: "success",
          });
        } else {
          throw new Error("Tipo de formulario no soportado");
        }
      } catch (error) {
        setNotification({
          message: `Error guardando los cambios: ${error.message}`,
          type: "error",
        });
      }
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleEditCellBlur();
    } else if (e.key === "Tab") {
      e.preventDefault();
      handleEditCellBlur();
      navigateToNextCell();
    }
  };

  const handleNewRowKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSaveNewRow();
    }
  };

  const navigateToNextCell = () => {
    if (editingCell) {
      const { rowIndex, columnName } = editingCell;
      const currentColumnIndex = columns.findIndex(
        (column) => column.name === columnName
      );
      let nextColumnIndex = currentColumnIndex + 1;
      let nextRowIndex = rowIndex;

      if (nextColumnIndex >= columns.length) {
        nextColumnIndex = 0;
        nextRowIndex = rowIndex + 1;
      }

      if (nextRowIndex < tableData.length) {
        const nextColumnName = columns[nextColumnIndex].name;
        const nextValue = tableData[nextRowIndex][nextColumnName];
        setEditingCell({ rowIndex: nextRowIndex, columnName: nextColumnName });
        setEditedValue(nextValue);
      } else if (isAddingNewRow && nextRowIndex === tableData.length) {
        const nextColumnName = columns[nextColumnIndex].name;
        const nextValue = newRow[nextColumnName] || "";
        setEditingCell({ rowIndex: nextRowIndex, columnName: nextColumnName });
        setEditedValue(nextValue);
      }
    }
  };

  const handleAddNewRow = () => {
    setIsAddingNewRow(true);
    setNewRow(
      columns.reduce((acc, column) => {
        acc[column.name] = "";
        return acc;
      }, {})
    );
  };

  const handleNewRowChange = (e, columnName) => {
    setNewRow({ ...newRow, [columnName]: e.target.value });
  };

  const handleSaveNewRow = async () => {
    const token = sessionStorage.getItem("token");
    let dataToSend;
    let url;

    if (
      formType === "CLIENTE" ||formType === "PROVEEDOR" ||formType === "TERCERO"
    ) {
      if (!newRow.ent_codigo || !newRow.ent_nombre) {
        setNotification({message: "El código y el nombre son requeridos",type: "error",});
        return;
      }

      const tipoEntidadMap = { CLIENTE: 1, PROVEEDOR: 2, TERCERO: 3 };

      dataToSend = {
        ent_codigo: newRow.ent_codigo,
        ent_nombre: newRow.ent_nombre,
        ent_nit: newRow.ent_nit,
        ent_telefono: newRow.ent_telefono,
        ent_idtipoentidad: tipoEntidadMap[formType],
      };
      setNotification({message: "Nueva entidad guardada",type: "success",});
      setClientes([...clientes, newRow]);
      setProveedores([...proveedores, newRow]);
      setTerceros([...terceros, newRow]);
      url = "https://ocean-syt-production.up.railway.app/entidad/";

    } else if (formType === "PRODUCTO" || formType === "VARIOS") {
      if (!newRow.prod_codigo || !newRow.prod_nombre) {
        setNotification({
          message: "El código y el nombre son requeridos",
          type: "error",
        });
        return;
      }

      const tipoProductodMap = { PRODUCTO: 1, VARIOS: 2 };

      dataToSend = {
        prod_codigo: newRow.prod_codigo,
        prod_nombre: newRow.prod_nombre,
        prod_idtipoproducto: tipoProductodMap[formType], // Asegúrate de que este mapeo es correcto
        prod_idunidadmedida: parseInt(newRow.prod_medida),
        prod_idprocesoproducto:
          formType === "VARIOS" ? 4 : parseInt(newRow.prod_proceso),
      };
      setProductos([...productos, newRow]);
      setVarios([...varios, newRow]);
      setNotification({message: "Nuevo producto guardado",type: "success",});



      url = "https://ocean-syt-production.up.railway.app/producto/";

    } else if (formType === "CONDUCTOR") {
      if (!newRow.conduct_nombre ) {
        setNotification({
          message: "El nombre es requerido",
          type: "error",
        });
        return;
      }

      dataToSend = {
        conduct_codigo: newRow.conduct_codigo,
        conduct_nombre: newRow.conduct_nombre,
        conduct_cedula: newRow.conduct_cedula,
        conduct_telefono: newRow.conductor_telefono,
      };
      setConductores([...conductores, newRow]);
      setNotification({message: "Nuevo conductor guardado",type: "success",});
      url = "https://ocean-syt-production.up.railway.app/conductor/";

    } else if (formType === "VEHICULO") {
      dataToSend = {
        vehi_placa: newRow.vehi_placa,
      };
      setVehiculos([...vehiculos, newRow]);
      setNotification({message: "Nuevo vehículo guardado",type: "success",});
      url = "https://ocean-syt-production.up.railway.app/vehiculo/";
    
    } else if (formType === "TRAILER") {
      dataToSend = {
        trai_placa: newRow.trai_placa,
      };
      setTrailers([...trailers, newRow]);
      setNotification({message: "Nuevo Trailer guardado",type: "success",});
      url = "https://ocean-syt-production.up.railway.app/trailer/";

    } else if (formType === "FACTURA") {
      dataToSend = {
        fac_fecha: newRow.fac_fecha,
      };
      setFacturas([...facturas, newRow]);
      setNotification({message: "Nueva factura guardada",type: "success",});
      url = "https://ocean-syt-production.up.railway.app/factura/";

    } else if (formType === "MEDIDA") {
      dataToSend = {
        um_nombre: newRow.um_nombre,
      };
      setUnidaMedida([...unidadesMedida, newRow]);
      setNotification({message: "Nueva medida guardada",type: "success",});
      url = "https://ocean-syt-production.up.railway.app/medida/";
      
    } else if (formType === "ORIGEN") {
      if (!newRow.ori_nombre || !newRow.ori_codigo) {
        setNotification({
          message: "El codigo y el nombre son requeridos",
          type: "error",
        });
        return;
      }
      dataToSend = {
        ori_codigo: newRow.ori_codigo,
        ori_nombre: newRow.ori_nombre,
      };
      setOrigenes([...origenes, newRow]);
      setNotification({message: "Nuevo origen guardado",type: "success",});
      url = "https://ocean-syt-production.up.railway.app/origen/";

    } else if (formType === "DESTINO") {
      if (!newRow.dest_nombre || !newRow.dest_codigo) {
        setNotification({
          message: "El codigo y el nombre son requeridos",
          type: "error",
        });
        return;
      }

      dataToSend = {
        dest_codigo: newRow.dest_codigo,
        dest_nombre: newRow.dest_nombre,
      };
      setDestinos([...destinos, newRow]);
      setNotification({message: "Nuevo destino guardado",type: "success",});
      url = "https://ocean-syt-production.up.railway.app/destino/";

    } else if (formType === "PATIO") {
      if (!newRow.pat_nombre || !newRow.pat_codigo) {
        setNotification({message: "El codigo y el nombre son requeridos",type: "error",});
        return;
      }
      dataToSend = {
        pat_codigo: newRow.pat_codigo,
        pat_nombre: newRow.pat_nombre,
      };
      setPatios([...patios, newRow]);
      setNotification({ message: "Nuevo patio guardado", type: "success" });
      url = "https://ocean-syt-production.up.railway.app/patio/";

    } else if (formType === "COMPRADOR") {
      if (!newRow.comp_nombre || !newRow.comp_codigo) {
        setNotification({
          message: "El codigo y el nombre son requeridos",
          type: "error",
        });
        return;
      }
      dataToSend = {
        comp_codigo: newRow.comp_codigo,
        comp_nombre: newRow.comp_nombre,
        comp_nit: newRow.comp_nit,
        comp_telefeono: newRow.comp_telefeono,
      };
      
      setCompradores([...compradores, newRow]);
      setNotification({message: "Nuevo comprador guardado",type: "success",});
      url = "https://ocean-syt-production.up.railway.app/comprador/";

    } else if (formType === "TRANSPORTADORA") {
      if (!newRow.trans_nombre || !newRow.trans_codigo) {
        setNotification({
          message: "El codigo y el nombre son requeridos",
          type: "error",
        });
        return;
      }
      dataToSend = {
        trans_codigo: newRow.trans_codigo,
        trans_nombre: newRow.trans_nombre,
        trans_ciudad: newRow.trans_ciudad,
        trans_nit: newRow.trans_nit,
        trans_telefono: newRow.trans_telefono,
        trans_direccion: newRow.trans_direccion,
      };
      setTransportadoras([...transportadoras, newRow]);
      setNotification({message: "Nueva transportadora guardada",type: "success",});
      url = "https://ocean-syt-production.up.railway.app/transportadora/";

    } else {
      setNotification({message: "Tipo de formulario no soportado",type: "error",});
      return;
    }

    try {
     
      await axios.post(url, dataToSend, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      setNewRow({});
       setIsAddingNewRow(false);
      
    } catch (error) {
      console.error("Error guardando nueva columna:", error);
      setNotification({
        message: "Error guardando el nuevo registro: " + error.message,
        type: "error",
      });
    }
  };

  
  const handleContextMenu = (e, rowIndex) => {
    e.preventDefault();
    setContextMenu({ show: true, x: e.clientX, y: e.clientY, rowIndex });

    setTimeout(() => {
      setContextMenu({ show: false, x: 0, y: 0, rowIndex: null });
    }, 10000);
  };

  const handleContextMenuAction = async (action) => {
    if (contextMenu.rowIndex !== null) {
      if (action === 'Eliminar') {
        // En lugar de llamar directamente a handleEliminar, mostramos el modal de confirmación
        setConfirmDelete({
          show: true,
          rowIndex: contextMenu.rowIndex,
        });
      }
      // Cierra el menú contextual
      setContextMenu({ show: false, x: 0, y: 0, rowIndex: null });
    }
  };
  
  const handleDoubleClickRegistro = (record) => {
    onDoubleClickRow && onDoubleClickRow(record);
  };


  const renderHeader = () => (
    <thead>
      <tr>
        {columns.map((column) => (
          <th
            key={column.name}
            className={`text-left py-2 px-2 border-b border-gray-200 bg-white whitespace-nowrap w-auto 
              ${column.name === 'consecutivo_tiquete' ? 'sticky left-0 bg-white z-[30]' : ''}`}
          >
            {column.title}
          </th>
        ))}
        {isAddingNewRow && (
          <th className="text-left py-2 px-2 border-b border-gray-200 bg-white"></th>
        )}
      </tr>
    </thead>
  );

  const renderBody = () => (
    <tbody>
      {tableData.map((record, rowIndex) => (
        <tr
          key={rowIndex}
          className={rowIndex % 2 === 0 ? "bg-white" : "bg-gray-100"}
          onContextMenu={(e) => handleContextMenu(e, rowIndex)}
        >
          {columns.map((column) => (
            <td
              key={column.name}
              className={`py-2 px-2 border-b whitespace-nowrap w-auto 
                ${column.name === 'consecutivo_tiquete' ? 'sticky left-0 bg-white z-[10]' :''}`}

              onDoubleClick={() => {
                if (["consecutivo", "consecutivo_tiquete", "tipo","peso_neto","unidad_medida","conductor_nombre","conductor_cedula",, "producto_codigo", "producto_nombre"].includes(column.name)) {
                  handleDoubleClickRegistro(record); // Aquí invocamos la función
                } else {
                  handleDoubleClick(rowIndex, column.name, record[column.name]);
                }
              }}

            >
              {editingCell &&
              editingCell.rowIndex === rowIndex &&
              editingCell.columnName === column.name ? (["consecutivo", "consecutivo_tiquete", "tipo","peso_neto","unidad_medida","conductor_nombre","conductor_cedula"].includes(column.name) ? (
                  record[column.name]
                ) : column.name === "conductor_nombre" &&
                  formType === "VEHICULO" &&
                  !isAddingNewRow ? (
                  record[column.name]
                ) : // Renderizar los campos editables para otros casos
                column.name === "prod_medida" ? (
                  <select
                    value={editedValue}
                    onChange={handleEditCellChange}
                    onBlur={handleEditCellBlur}
                    className="border border-gray-300 rounded p-2"
                    autoFocus
                  >
                    <option value="">
                      Seleccionar unidad
                    </option>
                    {unidadesMedida.map((unidad) => (
                      <option key={unidad.um_id} value={unidad.um_id}>
                        {unidad.um_nombre}
                      </option>
                    ))}
                  </select>
                ) : column.name === "prod_proceso" ? (
                  <select
                    value={editedValue}
                    onChange={handleEditCellChange}
                    onBlur={handleEditCellBlur}
                    className="border border-gray-300 rounded p-2"
                    autoFocus
                  >
                     <option value="">
                      Seleccionar proceso
                    </option>
                    {procesosProducto.map((proceso) => (
                      <option key={proceso.pp_id} value={proceso.pp_id}>
                        {proceso.pp_nombre}
                      </option>
                    ))}
                  </select>
                ) : column.name === "fecha_entrada" ||
                  column.name === "fecha_salida" ? (
                  <input
                    type="date"
                    value={moment(editedValue)
                      .tz("America/Bogota")
                      .format("YYYY-MM-DD")}
                    onChange={(e) => setEditedValue(e.target.value)}
                    onBlur={handleEditCellBlur}
                    className="border border-gray-300 rounded"
                    autoFocus
                  />
                ) : column.name === "hora_entrada" ||
                  column.name === "hora_salida" ? (
                  <input
                    type="time"
                    value={moment(editedValue, "HH:mm")
                      .tz("America/Bogota")
                      .format("HH:mm")}
                    onChange={(e) => setEditedValue(e.target.value)}
                    onBlur={handleEditCellBlur}
                    className="border border-gray-300 rounded"
                    autoFocus
                  />
                ) : (column.name === "entidad_nombre" ||
                    column.name === "entidad_codigo") &&
                  formType === "INGRESO" ? (
                  <select
                    value={editedValue}
                    onChange={handleEditCellChange}
                    onBlur={handleEditCellBlur}
                    className="border border-gray-300 rounded p-2"
                    autoFocus
                  >
                    {proveedores.map((proveedor) => (
                      <option
                        key={proveedor.ent_id}
                        value={
                          column.name === "entidad_nombre"
                            ? proveedor.ent_nombre
                            : proveedor.ent_codigo
                        }
                      >
                        {column.name === "entidad_nombre"
                          ? proveedor.ent_nombre
                          : proveedor.ent_codigo}
                      </option>
                    ))}
                  </select>
                ) : (column.name === "entidad_nombre" ||
                    column.name === "entidad_codigo") &&
                  formType === "DESPACHO" ? (
                  <select
                    value={editedValue}
                    onChange={handleEditCellChange}
                    onBlur={handleEditCellBlur}
                    className="border border-gray-300 rounded p-2"
                    autoFocus
                  >
                    {clientes.map((cliente) => (
                      <option
                        key={cliente.ent_id}
                        value={
                          column.name === "entidad_nombre"
                            ? cliente.ent_nombre
                            : cliente.ent_codigo
                        }
                      >
                        {column.name === "entidad_nombre"
                          ? cliente.ent_nombre
                          : cliente.ent_codigo}
                      </option>
                    ))}
                  </select>
                ) : (column.name === "entidad_nombre" ||
                    column.name === "entidad_codigo") &&
                  formType === "SERVICIOS" ? (
                  <select
                    value={editedValue}
                    onChange={handleEditCellChange}
                    onBlur={handleEditCellBlur}
                    className="border border-gray-300 rounded p-2"
                    autoFocus
                  >
                    {terceros.map((tercero) => (
                      <option
                        key={tercero.ent_id}
                        value={
                          column.name === "entidad_nombre"
                            ? tercero.ent_nombre
                            : tercero.ent_codigo
                        }
                      >
                        {column.name === "entidad_nombre"
                          ? tercero.ent_nombre
                          : tercero.ent_codigo}
                      </option>
                    ))}
                  </select>
                ) : column.name === "comprador_nombre" ||
                  column.name === "comprador_codigo" ? (
                  <select
                    value={editedValue}
                    onChange={handleEditCellChange}
                    onBlur={handleEditCellBlur}
                    className="border border-gray-300 rounded p-2"
                    autoFocus
                  >
                    {compradores.map((comprador) => (
                      <option
                        key={comprador.comp_id}
                        value={
                          column.name === "comprador_nombre"
                            ? comprador.comp_nombre
                            : comprador.comp_codigo
                        }
                      >
                        {column.name === "comprador_nombre"
                          ? comprador.comp_nombre
                          : comprador.comp_codigo}
                      </option>
                    ))}
                  </select>
                ) : (column.name === "producto_nombre" ||
                    column.name === "producto_codigo") &&
                  formType === "INGRESO" ? (
                  <select
                    value={editedValue}
                    onChange={handleEditCellChange}
                    onBlur={handleEditCellBlur}
                    className="border border-gray-300 rounded p-2"
                    autoFocus
                  >
                    {[...productosEntrada, ...productosEntradaSalida].map(
                      (productoEntrada) => (
                        <option
                          key={productoEntrada.id_producto}
                          value={
                            column.name === "producto_nombre"
                              ? productoEntrada.nombre_producto
                              : productoEntrada.codigo_producto
                          }
                        >
                          {column.name === "producto_nombre"
                            ? productoEntrada.nombre_producto
                            : productoEntrada.codigo_producto}
                        </option>
                      )
                    )}
                  </select>
                ) : (column.name === "producto_nombre" ||
                    column.name === "producto_codigo") &&
                  formType === "DESPACHO" ? (
                  <select
                    value={editedValue}
                    onChange={handleEditCellChange}
                    onBlur={handleEditCellBlur}
                    className="border border-gray-300 rounded p-2"
                    autoFocus
                  >
                    {[...productosSalida, ...productosEntradaSalida].map(
                      (productoSalida) => (
                        <option
                          key={productoSalida.id_producto}
                          value={
                            column.name === "producto_nombre"
                              ? productoSalida.prod_nombre
                              : productoSalida.prod_codigo
                          }
                        >
                          {column.name === "nombreProducto"
                            ? productoSalida.nombre_producto
                            : productoSalida.codigo_producto}
                        </option>
                      )
                    )}
                  </select>
                ) : (column.name === "producto_nombre" ||
                    column.name === "producto_codigo") &&
                  formType === "SERVICOS" ? (
                  <select
                    value={editedValue}
                    onChange={handleEditCellChange}
                    onBlur={handleEditCellBlur}
                    className="border border-gray-300 rounded p-2"
                    autoFocus
                  >
                    {varios.map((vario) => (
                      <option
                        key={vario.prod_id}
                        value={
                          column.name === "producto_nombre"
                            ? vario.prod_nombre
                            : vario.prod_codigo
                        }
                      >
                        {column.name === "producto_nombre"
                          ? vario.prod_nombre
                          : vario.prod_codigo}
                      </option>
                    ))}
                  </select>
                ) : column.name === "patio_nombre" ? (
                  <select
                    value={editedValue}
                    onChange={handleEditCellChange}
                    onBlur={handleEditCellBlur}
                    className="border border-gray-300 rounded p-2"
                    autoFocus
                  >
                    {patios.map((patio) => (
                      <option key={patio.pat_id} value={patio.pat_nombre}>
                        {patio.pat_nombre}
                      </option>
                    ))}
                  </select>
                ) : column.name === "origen_nombre" ? (
                  <select
                    value={editedValue}
                    onChange={handleEditCellChange}
                    onBlur={handleEditCellBlur}
                    className="border border-gray-300 rounded p-2"
                    autoFocus
                  >
                    {origenes.map((origen) => (
                      <option key={origen.ori_id} value={origen.ori_nombre}>
                        {origen.ori_nombre}
                      </option>
                    ))}
                  </select>
                ) : column.name === "destino_nombre" ||
                  column.name === "destino_codigo" ? (
                  <select
                    value={editedValue}
                    onChange={handleEditCellChange}
                    onBlur={handleEditCellBlur}
                    className="border border-gray-300 rounded p-2"
                    autoFocus
                  >
                    {destinos.map((destino) => (
                      <option
                        key={destino.dest_id}
                        value={
                          column.name === "destino_nombre"
                            ? destino.dest_nombre
                            : destino.dest_codigo
                        }
                      >
                        {column.name === "destino_nombre"
                          ? destino.dest_nombre
                          : destino.dest_codigo}
                      </option>
                    ))}
                  </select>
                ) : column.name === "factura_fecha" ? (
                  formType === "FACTURA" ? (
                    <input
                      type="text"
                      value={editedValue}
                      onChange={handleEditCellChange}
                      onBlur={handleEditCellBlur}
                      className="border border-gray-300 rounded p-2"
                      autoFocus
                    />
                  ) : (
                    <select
                      value={editedValue}
                      onChange={handleEditCellChange}
                      onBlur={handleEditCellBlur}
                      className="border border-gray-300 rounded p-2"
                      autoFocus
                    >
                      {facturas.map((factura) => (
                        <option key={factura.fac_id} value={factura.fac_fecha}>
                          {factura.fac_fecha}
                        </option>
                      ))}
                    </select>
                  )
                ) : column.name === "transportadora_nombre" ? (
                  <select
                    value={editedValue}
                    onChange={handleEditCellChange}
                    onBlur={handleEditCellBlur}
                    className="border border-gray-300 rounded p-2"
                    autoFocus
                  >
                    {transportadoras.map((transportadora) => (
                      <option
                        key={transportadora.trans_id}
                        value={transportadora.trans_nombre}
                      >
                        {transportadora.trans_nombre}
                      </option>
                    ))}
                  </select>
                ) : //Cambios

                column.name === "conductor_nombre" ? (
                  <select
                    value={editedValue}
                    onChange={handleEditCellChange}
                    onBlur={handleEditCellBlur}
                    className="border border-gray-300 rounded p-2"
                    autoFocus
                  >
                    {conductores.map((conductor) => (
                      <option
                        key={conductor.conduct_id}
                        value={conductor.conduct_nombre}
                      >
                        {conductor.conduct_nombre}
                      </option>
                    ))}
                  </select>
                ) : //trailer

                column.name === "trailer_placa" ? (
                  formType === "TRAILER" ? (
                    <input
                      type="text"
                      value={editedValue}
                      onChange={handleEditCellChange}
                      onBlur={handleEditCellBlur}
                      className="border border-gray-300 rounded p-2"
                      autoFocus
                    />
                  ) : (
                    <select
                      value={editedValue}
                      onChange={handleEditCellChange}
                      onBlur={handleEditCellBlur}
                      className="border border-gray-300 rounded p-2"
                      autoFocus
                    >
                      {trailers.map((trailer) => (
                        <option
                          key={trailer.trai_id}
                          value={trailer.trai_placa}
                        >
                          {trailer.trai_placa}
                        </option>
                      ))}
                    </select>
                  )
                ) : column.name === "vehiculo_placa" &&
                  (formType === "INGRESO" ||
                    formType === "DESPACHO" ||
                    formType === "SERVICIOS") ? (
                  <select
                    value={editedValue}
                    onChange={handleEditCellChange}
                    onBlur={handleEditCellBlur}
                    className="border border-gray-300 rounded p-2"
                    autoFocus
                  >
                    {vehiculos.map((vehiculo) => (
                      <option
                        key={vehiculo.vehi_id}
                        value={vehiculo.vehi_placa}
                      >
                        {vehiculo.vehi_placa}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    type="text"
                    value={editedValue}
                    onChange={handleEditCellChange}
                    onBlur={handleEditCellBlur}
                    onKeyDown={handleKeyDown}
                    className="border border-gray-300 rounded"
                    autoFocus
                  />
                )
              ) : typeof record[column.name] === "object" &&
                record[column.name] !== null ? (
                record[column.name].label
              ) : (
                record[column.name]
              )}
            </td>
          ))}
          {isAddingNewRow && rowIndex === tableData.length && (
            <td className="py-2 px-2 border-b">
              <button onClick={handleSaveNewRow} className="text-green-500">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 inline-block"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </button>
            </td>
          )}
        </tr>
      ))}
      {isAddingNewRow && (
        <tr>
          {columns.map((column) => (
            <td key={column.name} className="py-2 px-2 border-b">
              {column.name === "prod_medida" ? (
                <select
                  value={newRow[column.name] || ""}
                  onChange={(e) => handleNewRowChange(e, column.name)}
                  className="w-full border border-gray-300 rounded p-2 text-xs"
                >
                  <option value="">Seleccione una unidad</option>
                  {unidadesMedida.map((unidad) => (
                    <option key={unidad.um_id} value={unidad.um_id}>
                      {unidad.um_nombre}
                    </option>
                  ))}
                </select>
              ) : column.name === "prod_proceso" ? (
                <select
                  value={newRow[column.name] || ""}
                  onChange={(e) => handleNewRowChange(e, column.name)}
                  className="w-full border border-gray-300 rounded p-2 text-xs"
                >
                  <option value="">Seleccione un proceso</option>
                  {procesosProducto.map((proceso) => (
                    <option key={proceso.pp_id} value={proceso.pp_id}>
                      {proceso.pp_nombre}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type="text"
                  placeholder={column.title}
                  value={newRow[column.name] || ""}
                  onChange={(e) => handleNewRowChange(e, column.name)}
                  className="w-full border border-gray-300 rounded p-2 text-xs"
                />
              )}
            </td>
          ))}
          <td
            colSpan={columns.length}
            className="py-2 px-2 border-b text-center"
          >
            <button onClick={handleSaveNewRow} className="text-green-500">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 inline-block"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </button>
          </td>
        </tr>
      )}

      {showAddButton && !isAddingNewRow && (
        <tr>
          <td
            colSpan={columns.length + (isAddingNewRow ? 1 : 0)}
            className="py-2 px-2 border-b text-center"
          >
            <button onClick={handleAddNewRow} className="text-blue-500">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 inline-block"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Agregar nuevo registro
            </button>
          </td>
        </tr>
      )}
    </tbody>
  );

  return (
    <div>
      {notification.message && (
        <Notification
          message={notification.message}
          type={notification.type}
          onConfirm={notification.onConfirm}
          onCancel={notification.onCancel}
        />
      )}
      
      <table className="min-w-full border-collapse">
        {renderHeader()}
        {renderBody()}
      </table>
    </div>
  );
};

export default Table;
