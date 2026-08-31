import { useNavigate } from "react-router-dom";

function SideMenuComponent({navigateTo, label, side, stackIndex = 0, stackCount = 1}){
  const navigate = useNavigate() // ne moze a href jer se brise state i osvezava stranica

  const heightPercent = 100 / stackCount // ako ima vise dugmadi na istoj strani, deli visinu medju njima

  const style = {
    position: "fixed",
    top: `${stackIndex * heightPercent}vh`, // pomera dugme na njegov deo visine ekrana
    [side]: 0, // left: 0 ili right: 0

    height: `${heightPercent}vh`, // deo visine umesto pune, ako ih ima vise
    color: "black", 
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    writingMode:  "vertical-rl", // tekst stoji uspravno
    transform: side === "left" ? "rotate(180deg)" : "rotate(0deg)",// rotiramo za 180 ako je leva menu komponenta
    transition: "background 0.3s",
    zIndex: 1000,

  };

  return(
    <div
      onClick={()=>navigate(navigateTo)}
      style={style}
      className="w-[75px] text-4xl bg-white hover:bg-[#DEFF5C] border-dotted border-black border-l-2"
    >
      {label}  
    </div>
  );
}

export default SideMenuComponent