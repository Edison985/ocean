
// InputField.js
import React from "react";

const InputField = ({ label, id, value, onChange, readOnly = false, type = "text" }) => {
  return (
    <div className="ml-1 p-1 flex w-full  ">      
      <label className="text-xs 2xl:text-base w-2/5 font-bold m-1 block mr-1 " htmlFor={id}>
        {label}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
       
        readOnly={readOnly}
        className="shadow w-3/4 text-xs 2xl:text-base appearance-none border-2 border-[#6D80A6] rounded px-1 text-[#182540] leading-tight focus:outline-none focus:ring-2 focus:[#6D80A6]"
      />
    </div>
  );
};

export default InputField; 

