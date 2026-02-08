// axios interceptor - presrece zahteve i automatski daje adekvatan header, komunikacija sa apijima
// proverava da li imamo access token i dodaje zahtevu automatski ako imamo PREDOBROOOOOOO
import axios from "axios"
import {ACCESS_TOKEN} from "./constants"

// uzimamo api
// pravim axios instancu preko koje cemo da pristupamo lakse bekendu
const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL
})

api.interceptors.request.use( // definisemo sta jos nas api treba da odradi pre nego sto dalje prosledi zahtev koji je dobio
    // request.use prima dve funkcije kao argumente:
    (config) => {// config je zapravo ceo zahtev
        const token = localStorage.getItem(ACCESS_TOKEN); // uzimam access token iz lokalne memorije browsera, ako tokena ima, tj ako je korisnik ulogovan
        if(token){
            config.headers.Authorization = `Bearer ${token}` // ako je ulogovan, dodajemo headeru zahteva jwt token
        }
        return config
    },
    (error) => { // hendlujemo error
        return Promise.reject(error)
    }
)

export default api // sad koristimo ovaj objekat za slanje zahteva kad smo ga skockali