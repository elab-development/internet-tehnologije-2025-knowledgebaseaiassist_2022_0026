import {Navigate} from "react-router-dom"
import {jwtDecode} from "jwt-decode"
import api from "../api"
import { REFRESH_TOKEN, ACCESS_TOKEN } from "../constants"
import { useState, useEffect } from "react"

function ProtectedRoute({children}){
    // proveravamo da li je ulogovan korisnik, ako nije redirectujemo na login
    // stitimo rute za baze znanja itd
    const [isAuthorized, setIsAuthorized] = useState(null)
    // kad se pozove setIsAuthorized, tj fja koju useState vraca, ponovo se pokrece funkcija, tj refreshuje stranica maltene, 
    // samo se drugo stanje prosledjuje u useState, i samim tim dodeljuje promenljivoj isAuthorized/jeUlogovan


    useEffect(()=>{
        auth().catch(()=>setIsAuthorized(false))
    },[]) // nema zavisnosti tkd ce se useEffect pokrenuti SAMO JEDNOM kad se pokrene stranica

    // funkcija za refresovanje access jwt tokena
    const refreshToken = async () =>{
        const refreshToken = localStorage.getItem(REFRESH_TOKEN)
        try{
            // preko axios instance api koju smo kreirali saljemo POST zahtev
            // putanji za refresh token, a u telu saljemo token koji smo malopre dobili
            // odgovor bekenda cuvamo u response
            const response = await api.post("/api/token/refresh",{ 
                refresh: refreshToken,
            });
            // nastavlja se funkcija tek kad smo dobili odgovor
            if(response.status==200){ // uspesno refreshovan token
                localStorage.setItem(ACCES_TOKEN, response.data.access)
                setIsAuthorized(true)
            }
            else{
                setIsAuthorized(false)
            }

        }
        catch(error){
            console.log(error)
            setIsAuthorized(false)
        }

    }

    // funkcija za proveru autorizacije
    const auth = async () => {
        const token = localStorage.getItem(ACCES_TOKEN);
        if(!token){
            // ako ne postoji access token, znaci da korisnik nije ulogovan
            setIsAuthorized(false)
            return
        }
        const decoded = jwtDecode(token) // dekodiran tokeb
        const tokenExp = decoded.tokenExp // datum kad istice token
        const now = Date.now() /1000 // da bude u sekundama

        if(tokenExp<now){
            // ako je istekao access token, pokusamo da ga refreshujemo
            await refreshToken()
        }
        else
            // ako jos vazi access token, korisnik je ulogovan
            setIsAuthorized(true)
    }

    if( isAuthorized === null){
        // dok neki state u useState koji nije null
        return <div>Loading...</div>
    }

    if(isAuthorized)
        return children
    else
        return <Navigate to="/login"/> 
    // prikazujemo sve komponente tj children ako je ulogovan, 
    // ako nije, redirektujemo na login page
    

}
export default ProtectedRoute