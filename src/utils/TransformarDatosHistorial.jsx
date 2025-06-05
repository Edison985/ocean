
const transformarDatosHistorial = (data) => {
    return data.map((item) => ({
      historial_id: item.his_id || "",
      historial_accion: item.his_accion || "",
      historial_fecha: item.his_fecha|| "",
      historial_hora: item.his_hora || "",
      historial_usuarioNombre: item.usuario?.usuario_nombre || "",
      historial_usuarioRol: item.usuario?.rol.rol_nombre || "",
      historial_registroConsecutivo: item.registro?.reg_consecutivo || "",
      historial_registroTipo: item.registro?.tipo.tr_nombre || ""
    

    }));
  };
  
  export default transformarDatosHistorial;
  