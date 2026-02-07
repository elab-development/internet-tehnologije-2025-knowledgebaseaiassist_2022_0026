import { useNavigate } from "react-router-dom";
function SideMenuComponent({navigateTo, label, side}){
    navigate = useNavigate() // ne moze a href jer se brise state i osvezava stranica

    const style = {
    position: "fixed",
    top: 0,
    [side]: 0, // left: 0 ili right: 0
    width: "100px",
    height: "100vh",
    backgroundColor: "#2c3e50",
    color: "white",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    writingMode: "vertical-rl", // tekst stoji uspravno
    textTransform: "uppercase",
    letterSpacing: "2px",
    transition: "background 0.3s",
    zIndex: 1000
  };

    return(
        <div
        onClick={()=>navigate(navigateTo)}
        style={style}
        >
          {label}  
        </div>
    );
}
export default SideMenuComponent