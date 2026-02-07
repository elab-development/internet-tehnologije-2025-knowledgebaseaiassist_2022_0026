function FormField({ label, type, value, onChange, placeholder }) {
  return (
    <div className="form-field" style={{ marginBottom: "15px" }}>
        {label &&(
            <label 
        //   style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}
            >
                {label}
            </label>)}
      
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        // style={}
        required
      />
    </div>
  );
}

export default FormField;