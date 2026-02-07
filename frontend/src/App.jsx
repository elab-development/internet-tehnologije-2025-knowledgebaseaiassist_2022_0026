
import react from 'react'
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import NotFound from './pages/NotFound'
import Home from './pages/Home'
import Register from './pages/Register'
import AIChat from './pages/AIChat'
import DocumentManager from './pages/DocumentManager'
import ProtectedRoute from './components/ProtectedRoute'
import './output.css'


function Logout(){
  localStorage.clear()
  return <Navigate to="/login"/>
}

function RegisterAndLogout(){
  // da bismo sprecili da slucajno jwt access tokeni dodju do register rute
  localStorage.clear()
  return <Register/>
}

function App() {


  return (
    <BrowserRouter>
      <Routes>
        <Route path = "/" element={ <ProtectedRoute> <Home/> </ProtectedRoute>}/>
        <Route path = "/ai_chat" element={ <ProtectedRoute> <AIChat/> </ProtectedRoute>}/>
        <Route path = "/document_manager" element={ <ProtectedRoute> <DocumentManager/> </ProtectedRoute>}/>
        <Route path = "/login" element={ <Login/>}/>
        <Route path = "/logout" element={ <Logout/>}/>
        <Route path = "/register" element={ <Register/>}/>
        <Route path = "*" element={ <NotFound/>}/>


      </Routes>
    </BrowserRouter>
  )
}

export default App
