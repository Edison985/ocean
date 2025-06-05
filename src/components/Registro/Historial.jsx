import React from "react";
import Table from "../Layouts/Tabla";
import transformarDatos from "../../utils/TransformarDatos";


const columnsHistorial = [
  { name: "consecutivo_tiquete", title: "TIQUETE"},
  { name: "consecutivo", title: "REGISTRO" },
  { name: "tipo", title: "TIPO" },
  { name: "vehiculo_placa", title: "PLACA" },
  { name: "conductor_cedula", title: "CEDULA CONDUCTOR" },
  { name: "conductor_nombre", title: "CONDUCTOR" },
  { name: "trailer_placa", title: "TRAILER" },
  { name: "fecha_entrada", title: "FECHA ENTRADA" },
  { name: "hora_entrada", title: "HORA ENTRADA" },
  { name: "fecha_salida", title: "FECHA SALIDA" },
  { name: "hora_salida", title: "HORA SALIDA" },
  
];

const TablaHistorial = ({ data = [], onDoubleClickRow }) => (
  <Table
    columns={columnsHistorial}
    data={transformarDatos(data)}
    onDoubleClickRow={onDoubleClickRow}
    editable={false}
  />
);

export default TablaHistorial;
