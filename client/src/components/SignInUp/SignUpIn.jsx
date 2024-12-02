import React, { useState, useRef } from "react";
import "./SignUpIn.css";
import { URL } from "../../constant.js";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from '../../hooks/AuthContext.jsx';

const SignUpIn = () => {
  const [isPanelActive, setIsPanelActive] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSignUp = () => {
    setIsPanelActive(true);
  };

  const handleSignIn = () => {
    setIsPanelActive(false);
  };

  const signUp = async (event) => {
    event.preventDefault();
    const user = {
      username: event.target.name.value,
      email: event.target.email.value,
      password: event.target.password.value,
      gender: event.target.gender.value,
      type: event.target.role.value,
    };
    // console.log(user, URL);
    try {
      const response = await fetch(`${URL}/user/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      alert("User added Successfully");
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to add user. Please try again." + error.message);
    }
  };


  const signIn = async (event) => {
    event.preventDefault();
    try {
    const userLogin = {
      username: event.target.username.value,
      password: event.target.password.value,
    };
      const response = await axios.post(`${URL}/user/validate`, userLogin, {
        headers: {
          "Content-Type": "application/json",
        },
      });
     
      alert("Logged in Successfully");
      const data  = response.data;
      console.log(data)
      const {token,user} = data;
      login(token,user);
      navigate("/home");
    } catch (error) {
      console.error("Error:", error);
      alert(
        "Failed to login. Please try again. " +
          (error.response ? error.response.status : error.message)
      );
    }
  };

  return (
    <div className="sui-login-body">
    <div className={`sui-container ${isPanelActive ? "sui-right-panel-active" : ""}`}>
      <div className="sui-form-container sui-sign-up-container">
          <form onSubmit={signUp}>
            <h1>Create Account</h1>
            <span>or use your email for registration</span>
            <input type="text" name="name" placeholder="Name" />
            <select id="gender" name="gender">
              <option value="male" selected>
                Male
              </option>
              <option value="female">Female</option>
            </select>
            <input type="email" name="email" placeholder="Email" />
            <input type="password" name="password" placeholder="Password" />
            <select id="role" name="role">
              <option value="student" selected>
                Student
              </option>
              <option value="teacher">Teacher</option>
            </select>
            <button className="sui-button">Sign Up</button>
          </form>
        </div>
        <div className="sui-form-container sui-sign-in-container">
          <form onSubmit={signIn}>
            <h1>Sign in</h1>
            <span>or use your account</span>
            <input type="text" name="username" placeholder="Username" />
            <input type="password" name="password" placeholder="Password" />
            <button className="sui-button" type="submit">Sign In</button>
          </form>
        </div>
        <div className="sui-overlay-container">
      <div className="sui-overlay">
        <div className="sui-overlay-panel sui-overlay-left">
              <h1>Welcome Back!</h1>
              <p>
                To keep connected with us please login with your personal info
              </p>
              <button className="sui-button sui-ghost" onClick={handleSignIn}>
                Sign In
              </button>
            </div>
            <div className="sui-overlay-panel sui-overlay-right">
              <h1>Hello, Friend!</h1>
              <p>Enter your personal details and start journey with us</p>
              <button className="sui-button sui-ghost" onClick={handleSignUp}>
                Sign Up
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUpIn;
