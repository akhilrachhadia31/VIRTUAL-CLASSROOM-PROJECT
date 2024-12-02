import React, { useState } from 'react';
import './ForgotPassword.css';
import axios from "axios";
import { useNavigate } from 'react-router-dom';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handlePasswordReset = async (event) => {
    event.preventDefault(); // Prevent form reload
    setMessage(''); // Clear previous messages

    try {
      const response = await axios.post("https://learne5.onrender.com/auth/forgot-password", {
        email: email,
      });

      if (response.status === 200) {
        // Clear localStorage and store the email for future reference
        localStorage.clear();
        localStorage.setItem("email", email);

        // Show success message and navigate to the reset page
        setMessage('A password reset link has been sent to your email.');
        setTimeout(() => navigate("/reset"), 2000); // Navigate after 2 seconds
      } else {
        throw new Error('Failed to send reset email.');
      }
    } catch (error) {
        alert("The email is not registered. Please check and try again.");
    }
  };

   

  return (
    <div className="forgot-password-container">
      <div className="forgot-password-box">
        <h1>Forgot Password</h1>
        <p>Enter your registered email, and we'll send you a reset link.</p>
        <form onSubmit={handlePasswordReset}>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="input-email"
            
          />
          <button type="submit" className="btn-submit">
            Send Reset Link
          </button>
        </form>
        {message && <p className="message">{message}</p>}
      </div>
    </div>
  );
};

export default ForgotPassword;