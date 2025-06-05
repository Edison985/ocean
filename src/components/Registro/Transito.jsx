import React from "react";
import Table from "../Layouts/Tabla";
import transformarDatos from "../../utils/TransformarDatos";


const columnsTransito = [
  { name: "consecutivo", title: "REGISTRO" },
  { name: "tipo", title: "TIPO" },
  { name: "vehiculo_placa", title: "PLACA" },
  { name: "conductor_cedula", title: "CEDULA CONDUCTOR" },
  { name: "conductor_nombre", title: "CONDUCTOR" },
  { name: "trailer_placa", title: "TRAILER" },
  { name: "fecha_entrada", title: "FECHA ENTRADA" },
  { name: "hora_entrada", title: "HORA ENTRADA" },
];

const TablaTransito = ({ data = [], onDoubleClickRow }) => (
  <Table
    columns={columnsTransito}
    data={transformarDatos(data)}
    editable={false}
    onDoubleClickRow={onDoubleClickRow}
  />
);

export default TablaTransito;
