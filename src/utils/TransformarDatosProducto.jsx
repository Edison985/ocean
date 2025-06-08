

const transformarDatosProducto = (data) => {
    console.log("🔥 Datos crudos recibidos:", data);
    return data.map((item) => ({
      prod_id: item.prod_id || "",
      prod_nombre: item.prod_nombre || "",
      prod_codigo: item.prod_codigo || "",
      prod_medida: item.unidad_medida?.um_nombre || "❌ SIN MEDIDA",
      prod_proceso: item.proceso_producto?.pp_nombre || "❌ SIN PROCESO",

    }));
  };
  
  export default transformarDatosProducto;
  