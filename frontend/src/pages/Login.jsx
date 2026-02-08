import AuthForm from "../components/AuthForm"

function Login(){
    return <AuthForm route="/api/token/get/" method="login"/>
}

export default Login