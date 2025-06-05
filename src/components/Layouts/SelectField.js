import { useState, useEffect } from 'react';
import Select from 'react-select';
import axios from 'axios'; 

const fieldsConfig = {
  placa: [
    { key: 'vehi_placa', placeholder: 'Ingrese nueva placa' }
  ],
  conductor: [
    { key: 'conduct_nombre', placeholder: 'Ingrese nombre del conductor' },
    { key: 'conduct_cedula', placeholder: 'Ingrese número de documento' },
    { key: 'conduct_telefono', placeholder: 'Ingrese número de telefono' }
  ],  
  trailer: [
    { key: 'trai_trailer', placeholder: 'Ingrese nuevo tráiler' }
  ], 
  factura: [
    { key: 'fac_fecha', placeholder: 'Ingrese nueva factura' }
  ], 
  cliente: [
    { key: 'ent_codigo', placeholder: 'Ingrese codigo de cliente' },
    { key: 'ent_nombre', placeholder: 'Ingrese nombre de cliente' },
    { key: 'ent_nit', placeholder: 'Ingrese nit' },
    { key: 'ent_telefono', placeholder: 'Ingresa télefono' }
  ],
  proveedor: [
    { key: 'ent_codigo', placeholder: 'Ingrese codigo de proveedor' },
    { key: 'ent_nombre', placeholder: 'Ingrese nombre de proveedor' },
    { key: 'ent_nit', placeholder: 'Ingrese nit' },
    { key: 'ent_telefono', placeholder: 'Ingresa télefono' }
  ],
  tercero: [
    { key: 'ent_codigo', placeholder: 'Ingrese codigo de tercero' },
    { key: 'ent_nombre', placeholder: 'Ingrese nombre de tercero' },
    { key: 'ent_nit', placeholder: 'Ingrese nit' },
    { key: 'ent_telefono', placeholder: 'Ingresa télefono' }
  ],
  producto: [
    { key: 'prod_codigo', placeholder: 'Ingrese codigo' },
    { key: 'prod_nombre', placeholder: 'Ingrese nombre de producto' },
    { key: 'prod_idunidadmedida', placeholder: 'Ingrese unidad de medida' },
    { key: 'prod_idprocesoproducto', placeholder: 'Ingrese proceso de producto' },    
   
  ],  
  varios: [
    { key: 'prod_codigo', placeholder: 'Ingrese codigo' },
    { key: 'prod_nombre', placeholder: 'Ingrese nombre de producto' },
    { key: 'prod_idunidadmedida', placeholder: 'Ingrese unidad de medida' },
    { key: 'prod_idprocesoproducto', placeholder: 'Ingrese proceso de producto' }, 
        
   
  ],  
  origen: [
    { key: 'ori_codigo', placeholder: 'Ingrese codigo' },
    { key: 'ori_nombre', placeholder: 'Ingrese nuevo origen' }
  ],
  destino: [
    { key: 'dest_codigo', placeholder: 'Ingrese codigo' },
    { key: 'dest_nombre', placeholder: 'Ingrese nuevo destino' }
  ],
  patio: [
    { key: 'pat_codigo', placeholder: 'Ingrese codigo' },
    { key: 'pat_nombre', placeholder: 'Ingrese nuevo patio' }
  ],
  comprador: [
    { key: 'comp_codigo', placeholder: 'Ingrese el codigo' },
    { key: 'comp_nombre', placeholder: 'Ingrese el nombre' },
    { key: 'comp_nit', placeholder: 'Ingrese el nit' },
    { key: 'comp_telefono', placeholder: 'Ingrese numero de telefono' },
    
  ],
  transportadora: [
    { key: 'trans_codigo', placeholder: 'Ingrese codigo' },
    { key: 'tran_nombre', placeholder: 'Ingrese nombre de transportadora' },
    { key: 'trans_nit', placeholder: 'Ingrese nit' },
    { key: 'trans_telefono', placeholder: 'Ingrese el telefono' },
    { key: 'trans_direccion', placeholder: 'Ingrese la direccion' },
    { key: 'trans_ciudad', placeholder: 'Ingrese ciudad' }
  ]
};

// Mapeo de tipos de entidad
const tipoEntidad = {
  cliente: 1,
  proveedor: 2,
  tercero: 3
};

const TipoProducto = {
  producto: 1,
  varios: 2
};

const SelectField = ({ 
  label, 
  id, 
  options = [], 
  value, 
  onChange, 
  apiUrl, 
  isDisabled,
  fieldType, 
  onAfterSave,
  showAddNew = false,
  
}) => {
  const [showModal, setShowModal] = useState(false);
  const [newData, setNewData] = useState({});
  const [loading, setLoading] = useState(false);
  const [unidadOptions, setUnidadOptions] = useState([]); 
  const [procesoOptions, setProcesoOptions] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null); // Añadir estado para controlar la selección actual

  

  // Cargar unidades de medida si es tipo producto
  useEffect(() => {

    const fetchUnidades = async () => {
      const token = sessionStorage.getItem("token");
      
      try {
        const response = await axios.get('https://ocean-syt-production.up.railway.app/medida/', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
        });
        const opciones = response.data.map(unidad => ({
          value: unidad.um_id,
          label: unidad.um_nombre
        }));
        setUnidadOptions(opciones);
      } catch (error) {
        console.error('Error cargando unidades de medida', error);
      }
    };

    if (fieldType === 'producto' || fieldType === 'varios') {
      fetchUnidades();
    }
  }, [fieldType]);

  //cargar procesos de prodcuto
  useEffect(() => {
    const fetchProcesos = async () => {
      const token = sessionStorage.getItem("token");
      
      try {
        const response = await axios.get('https://ocean-syt-production.up.railway.app/proceso/', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const opciones = response.data.map(proceso => ({
          value: proceso.pp_id,
          label: proceso.pp_nombre
        }));
        setProcesoOptions(opciones);
      } catch (error) {
        console.error('Error cargando procesos', error);
      }
    };

    if (fieldType === 'producto' || fieldType === 'varios') {
      fetchProcesos();
    }
  }, [fieldType]);

  useEffect(() => {
    if (fieldsConfig[fieldType]) {
      const initialData = {};
      fieldsConfig[fieldType].forEach(field => {
        initialData[field.key] = '';
      });
      setNewData(initialData);
    }
  }, [fieldType]);

  useEffect(() => {
    if (fieldType) {
      setNewData(prevData => {
        const updatedData = { ...prevData };
  
        if (tipoEntidad[fieldType]) {
          updatedData.ent_idtipoentidad = tipoEntidad[fieldType];
        }
  
        if (TipoProducto[fieldType]) {
          updatedData.prod_idtipoproducto = TipoProducto[fieldType];
        }
  
        return updatedData;
      });
    }
  }, [fieldType]);

  // Actualizar selectedOption cuando value cambie
  useEffect(() => {
    const currentOption = options.find(option => option.value === value);
    setSelectedOption(currentOption ? { value: currentOption.value, label: currentOption.label } : null);
  }, [value, options]);

  const formattedOptions = options.map(option => ({
    value: option.value,
    label: option.label,
  }));

  // Sólo añadir "Agregar nuevo" si showAddNew está activado y no cuando hay opciones seleccionadas
  const getSelectOptions = () => {
    if (showAddNew) {
      return [...formattedOptions, { value: 'add_new', label: '➕ Agregar nuevo' }];
    }
    return formattedOptions;
  };

  const handleSelectChange = (option) => {
    if (option?.value === 'add_new') {
      setShowModal(true);
      // No actualizar el estado selectedOption ni llamar a onChange
    } else {
      setSelectedOption(option);
      onChange(option);
    }
  };

  const handleSave = async () => {
    if (!apiUrl) {
      console.error("Error: apiUrl no está definido.");
      return;
    }
    const token = sessionStorage.getItem("token");
    setLoading(true);


    try {
      await axios.post(apiUrl, newData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setShowModal(false);

      if (onAfterSave) {
        await onAfterSave(); 
      }

      if (fieldsConfig[fieldType]) {
        const resetData = {};
        fieldsConfig[fieldType].forEach(field => {
          resetData[field.key] = '';
        });
        setNewData(resetData);
      }
    } catch (error) {
      console.log("ERROR GUARDANDO NUEVO REGISTRO.!!");
    } finally {
      setLoading(false);
    }
  };

  const customStyles = {
    control: (provided) => ({
      ...provided,
      minHeight: '24px',
      height: '24px',
      padding: '0 5px',
    }),
    valueContainer: (provided) => ({
      ...provided,
      height: '24px',
      padding: '0 1px',
    }),
    input: (provided) => ({
      ...provided,
      margin: '0px',
    }),
    indicatorSeparator: (provided) => ({
      ...provided,
      display: 'none',
    }),
    indicatorsContainer: (provided) => ({
      ...provided,
      height: '24px',
    }),
  };
  
  return (
    <div className="mb-1 p-0 flex w-full content-center">
      {label && (
        <label className="text-xs 2xl:text-base w-1/4 font-bold m-1 block mr-1" htmlFor={id}>
          {label}
        </label>
      )}
      <Select
        id={id}
        value={selectedOption}
        onChange={handleSelectChange}
        options={getSelectOptions()}
        filterOption={(option, inputValue) => {
          if (option.data.value === 'add_new') return true;
          return (option.label?.toLowerCase() || "").includes(inputValue?.toLowerCase() || "");
        }}
        noOptionsMessage={() => null}
        styles={customStyles}
        className={`text-xs 2xl:text-base text-[#0c243a] focus:outline-none focus:ring-2 focus:ring-[#297bc2a3] ${
          label ? 'w-3/4' : 'w-11/12'
        }`}
        classNamePrefix="select"
        isDisabled={isDisabled}
      />

      {/* Modal de agregar nueva entidad */}
      {showModal && (
        <div className="fixed inset-0 z-10 flex items-center justify-center bg-gray-800 bg-opacity-50">
          <div className="bg-white p-5 rounded-lg shadow-lg w-1/3">
            <h2 className="text-xl font-bold mb-4 text-[#0c243a]">Agregar</h2>

            {fieldsConfig[fieldType]?.map(field => (
              field.key === 'prod_idunidadmedida' ? (
                <Select
                  key={field.key}
                  value={unidadOptions.find(opt => opt.value === newData[field.key])}
                  onChange={(selected) =>
                    setNewData({ ...newData, [field.key]: selected ? selected.value : '' })
                  }
                  options={unidadOptions}
                  placeholder="Seleccione unidad de medida"
                  styles={customStyles}
                  className="w-full text-xs 2xl:text-base text-[#0c243a] font-semibold border rounded mb-3"
                />
              ) : field.key === 'prod_idprocesoproducto' ? (
                <Select
                  key={field.key}
                  value={procesoOptions.find(opt => opt.value === newData[field.key])}
                  onChange={(selected) =>
                    setNewData({ ...newData, [field.key]: selected ? selected.value : '' })
                  }
                  options={procesoOptions}
                  placeholder="Seleccione proceso"
                  styles={customStyles}
                  className="w-full text-xs 2xl:text-base text-[#0c243a] font-semibold border rounded mb-3"
                />
              ) : (
                <input
                  key={field.key}
                  type="text"
                  value={newData[field.key] || ''}
                  onChange={(e) =>
                    setNewData({ ...newData, [field.key]: e.target.value })
                  }
                  className="w-full text-xs 2xl:text-base text-[#0c243a] font-semibold border p-2 rounded mb-4"
                  placeholder={field.placeholder}
                />
              )
            ))}

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowModal(false)}
                className="bg-gray-400 text-white px-4 py-2 text-xs 2xl:text-base rounded"
              >
                Cancelar
              </button>
              <button
                onClick={handleSave}
                className="bg-[#0c243a] text-xs 2xl:text-base text-white px-4 py-2 rounded"
                disabled={loading}
              >
                {loading ? 'Guardando...' : 'Guardar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SelectField;


