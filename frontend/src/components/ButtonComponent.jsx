
function ButtonComponent({label}){

    return (<div className="relative h-24 w-96 group ">
            <div className="absolute inset-0 bg-gray-800 blur-lg transition-all duration-300 group-hover:blur-sm z-0"></div>
            <button className="h-24 z-10 w-96 text-4xl relative pointer-events-auto submit-button w-72 text-[#DEFF5C] cursor-pointer transition-transform active:scale-95" type="submit"> {label} </button>
            </div>
);}
export default ButtonComponent