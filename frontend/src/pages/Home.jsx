import SideMenuComponent from "../components/SideMenuComponent"
import { useState, useEffect } from "react";
import api from "../api";
import { Navigate, useNavigate } from "react-router-dom";


function Home(){

    // da bismo dobili ime ulogovanog korisnika
    const [firstName,setFirstName] = useState("");
    const [documents,setDocuments] = useState("");
    const [loading,setLoading] = useState("");
    const navigate = useNavigate();


    const getDocuments = async () => {
        try {
            setLoading(true);
            const response = await api.get("/api/document/upload/"); 
            setDocuments(response.data);
        } catch (error) {
            console.error("Error while loading the documents:", error);
            alert("Loading your documents was not successful.");
        } finally {
            setLoading(false);
        }
    };
        const getProfile = async () => {
        try {
            const response = await api.get("/api/user/profile/");
            setFirstName(response.data.first_name);
        } catch (error) {
            navigate("/login/");
        }
    };


    useEffect(() => {
        getDocuments();
        getProfile();
    }, []);//pokrece se jednom pri ucitavanju stranice


    const numOfDocs = documents.length
    return <div className="overflow-hidden" > 
        
        <div className="ml-18 mr-18 h-screen relative ">
            {/* <div className="fixed bg-black/10 right-4"> */}
            <button 
                type="button" 
                className="  fixed right-0 p-12 pr-30  hover:underline text-xl self-end align-end justify-end text-right text-black cursor-pointer transition-all active:scale-95" 
                onClick={() => navigate("/logout/")}>
                Logout
            </button>
            {/* </div> */}
        <h1 className="font-dots text-9xl pl-12 pt-12 leading-15 w-186">
            Welcome to your <br></br> <br></br> Personal Knowledge Base</h1>
        <p className="fixed text-4xl text-right p-12 pr-12 bottom-0 right-18 w-200 ">
            {firstName}, you have uploaded a total of {numOfDocs} documents! Insane!</p>
     
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