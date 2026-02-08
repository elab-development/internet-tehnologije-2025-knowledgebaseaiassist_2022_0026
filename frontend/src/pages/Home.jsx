import SideMenuComponent from "../components/SideMenuComponent"
import { useState, useEffect } from "react";
import api from "../api";
import { Navigate, useNavigate } from "react-router-dom";


function Home(){

    // da bismo dobili ime ulogovanog korisnika
    const [firstName,setFirstName] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
    const fetchProfile = async () => {
        try {
            const response = await api.get("/api/user/profile/");
            setFirstName(response.data.first_name);
        } catch (error) {
            navigate("/login/");
        }
    };

    fetchProfile();
}, []);//pokrece se jednom pri ucitavanju stranice

    return <div className="overflow-hidden"> 
        <div>
        <h1 className="font-dots text-9xl pl-30 pt-12 leading-15 w-186">Welcome to your <br></br> <br></br> Personal Knowledge Base</h1>
        <p className="text-4xl text-right pr-30 bottom-12 w">{firstName}, you have uploaded a total of 34 documents!</p>
        <button type="button" onClick={logout}>Logout</button>
        </div>


        <SideMenuComponent
        navigateTo="/ai_chat"
        label = "AI chat"
        side = "right"
        ></SideMenuComponent>
        <SideMenuComponent
        navigateTo="/document_manager"
        label = "document manager"
        side = "left"
        ></SideMenuComponent>
    </div>
}
export default Home