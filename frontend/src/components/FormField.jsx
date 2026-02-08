function FormField({ label, type, value,className, onChange, placeholder }) {
  return (
    <div className="flex flex-col gap-2" >
        {label &&(
            <label 
        //   style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}
            >
                {label}
            </label>)}
      
       {/* da bismo mogli da prilagodimo nesto specificno */}
      <div className={`relative h-12 w-72 ${className}`}>
      <div className="absolute inset-0 bg-[#E7E7E7] blur-sm pointer-events-none"></div>
      <input className="relative h-full z-10 w-full bg-transparent text-black text-right pr-4 focus:outline-none"
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        // style={}
        required
      />
      </div>
    </div>
  );
}

export default FormField;