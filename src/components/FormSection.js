

const FormSection = ({ title, children, className = "" }) => {
  return (
    <div className={`m-1 xl:m-2 2xl:m-4 p-0 ${className}`}>
      {title && (
        <div className="bg-[#6D80A6] p-1 border rounded-t-lg">
          <h2 className="text-xs 2xl:text-base font-semibold text-[#f2f2f2] text-center">
            {title}
          </h2>
        </div>
      )}
      <div className="p-1  bg-white rounded-b-lg">
        <div className="gap-1">
          <div className="">{children}</div>
        </div>
      </div>
    </div>
  );
};

export default FormSection; 
