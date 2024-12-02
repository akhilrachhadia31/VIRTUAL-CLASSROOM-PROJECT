import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";

import Login from "./pages/Login";
import Signup from "./pages/signup";
import VerifyOtp from "./pages/VerifyOTP/VerifyOtp";
import ForgotPassword from "./pages/ForgotPassword/ForgotPassword";
import ResetPassword from "./pages/resetpassword/reset.jsx";
import { AuthProvider } from "./hooks/AuthContext";
import Home from "./pages/HomePage";

function App() {
  const loggedin = localStorage.getItem('isloggedin');
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path = "/" element = {loggedin ?  <Home/> : <Login/>}/>
          <Route path = "/login" element = {<Login/>}/>
          <Route path = "/signup" element = {<Signup/>}/>
          <Route path = "/verify" element = {<VerifyOtp/>}/>
          <Route path = "/Forget" element = {<ForgotPassword/>}/>
          <Route path = "/reset" element = {<ResetPassword/>}/>
          <Route path="/home/*" element={<Home />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;


