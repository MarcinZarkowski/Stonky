

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import Login from "./pages/Login"
import Register from "./pages/Register"
import Home from "./pages/Home"
import NotFound from "./pages/404"
import ProtectedRoute from "./components/ProtectedRoute"
import ForgotPassword from "./pages/ForgotPassword"
import Verify from "./pages/Verify"
import PasswordReset from "./pages/PasswordReset"
import Navbar from "./components/Navbar"
import "./app.css"
import StockPage from "./pages/StockPage"


function RegisterAndLogout() {
  localStorage.clear()
  return <Register />
}
function Logout() {
  localStorage.clear()
  return <Navigate to="/login" />
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <ProtectedRoute>  
              <Navbar>
                <Home />
              </Navbar>
            </ProtectedRoute>
          }
        />
        <Route
          path="/stock/:ticker"
          element={
            <ProtectedRoute>
              <Navbar>
                <StockPage/>
              </Navbar>
            </ProtectedRoute>
          }
        />
        <Route path="/login" element={ <Login/>} />
        <Route path="/logout" element={<Logout route='/api/token/' type='Login'/>} />
        <Route path="/register" element={<RegisterAndLogout/>} />
        <Route path="/forgot-password" element={<ForgotPassword/>}></Route>
        <Route path="/email-verification/:token" element={ <Verify />}></Route>
        <Route path="/password-reset/:token" element={<PasswordReset/>}></Route> 
        <Route path="*" element={<NotFound />}></Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App