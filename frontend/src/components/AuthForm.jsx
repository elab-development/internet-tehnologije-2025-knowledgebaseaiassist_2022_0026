import {useState} from "react"
import api from "../api"
import { useNavigate } from "react-router-dom"
import { ACCESS_TOKEN } from "../constants"
import { REFRESH_TOKEN } from "../constants"
import FormField from "./FormField"
import ButtonComponent from "./ButtonComponent.jsx"

import "../styles/AuthForm.css"

// forma koja se koristi za login i za registraciju
// method je string koji nam ukazuje na to o kojoj od ove dve metode se radi
function AuthForm({route,method}){
    // useState za svako polje unosa
    const [username,setUsername]= useState("")
    const [password, setPassword] = useState("")
    const [first_name,setFirstName] = useState("")
    const [last_name, setLastName] = useState("")
    const [email, setEmail] = useState("")

    const [loading, setLoading]= useState(false)

    // funkcija za navigaciju do druge stranice
    const navigate = useNavigate()

    const isRegister = (method==="register")

    // asinhrona funkcija koja se izvrsava pri submitovanju forme
    const handleSubmit = async (e)=>{
        setLoading(true);
        // sprecavamo da se stranica osvezi nakon submitovane forme
        e.preventDefault()
        try{
            if(method==="login"){
                // za login se u post zahtevu do dodeljene rute prosledjuju samo username i password
                const response = await api.post(route,{
                    username,
                    password
                })
                // na osnovu odgovora bekenda se dodeljuju access i refresh token
                localStorage.setItem(ACCESS_TOKEN, response.data.access);
                localStorage.setItem(REFRESH_TOKEN, response.data.refresh);
                // nakon logina preusmereni smo na home
                navigate("/")
            }
            else{
                // za register se u post zahtevu prosledjuju i email, ime i przime
                await api.post(route,{
                    username,
                    password,
                    email,
                    first_name,
                    last_name
                })
                alert("You have registered successfully!")
                // nakon registracije smo preusmereni na login stranicu
                navigate("/login")
            }
        }
        catch(error){
            alert(error) // alertuje sa status kodom ako nisu dobri kredencijali
        }
        finally{
            setLoading(false)
        }
    }

    const formName = method==="login"?"Login":"Register"
    const buttonName = loading?"LOADING...":(method==="login"?"login":"create an acc")

    return (
        <div className="min-h-screen  w-full flex flex-col items-center justify-center">
            <form onSubmit={handleSubmit} className="flex flex-col items-center auth-form gap-12">
                <h1 className="font-dots text-8xl">{formName}</h1>

                {/*naredna tri polja se prikazuju samo u slucaju registracije*/}
                {isRegister && (
                    <div className="flex flex-col gap-12">
                        <FormField
                            value={first_name}
                            type="text"
                            placeholder="first name"
                            // pri svakoj promeni u polju, setujemo novu vrednost imenu
                            onChange={(e)=>setFirstName(e.target.value)}
                        ></FormField>

                        <FormField
                            value={last_name}
                            type="text"
                            placeholder="last name"
                            onChange={(e)=>setLastName(e.target.value)}
                        ></FormField>

                        <FormField
                            value={email}
                            type="text"
                            placeholder="email"
                            onChange={(e)=>setEmail(e.target.value)}
                        ></FormField>
                    </div>
                )}

                <FormField
                    value={username}
                    type="text"
                    placeholder="username"
                    onChange={(e)=>setUsername(e.target.value)}
                ></FormField>
                
                <FormField
                    value={password}
                    type="password"
                    placeholder="password"
                    onChange={(e)=>setPassword(e.target.value)}
                ></FormField>
                
                <ButtonComponent label={buttonName}></ButtonComponent>

            </form>
        </div>
    )
}

export default AuthForm