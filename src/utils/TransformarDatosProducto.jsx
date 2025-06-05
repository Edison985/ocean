

const transformarDatosProducto = (data) => {
    return data.map((item) => ({
      producto_id: item.prod_id || "",
      producto_nombre: item.prod_nombre || "",
      producto_codigo: item.prod_codigo || "",
      producto_medida: item.unidad_medida?.um_nombre || "",
      producto_proceso: item.proceso_producto?.pp_nombre || ""

    }));
  };
  
  export default transformarDatosProducto;
  