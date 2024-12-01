import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./reset.css";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordRules, setPasswordRules] = useState({
    hasUppercase: false,
    hasLowercase: false,
    hasDigit: false,
    hasSpecialChar: false,
    hasValidLength: false,
  });
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  const email = localStorage.getItem("email");

  useEffect(() => {
    if (!email) {
      navigate("/forget");
    }
  }, [email, navigate]);

  useEffect(() => {
    setPasswordRules({
      hasUppercase: /[A-Z]/.test(password),
      hasLowercase: /[a-z]/.test(password),
      hasDigit: /[0-9]/.test(password),
      hasSpecialChar: /[!@#$%^&*]/.test(password),
      hasValidLength: password.length >= 8 && password.length <= 12,
    });
  }, [password]);

  const handleResetPassword = async (event) => {
    event.preventDefault();

    if (password !== confirmPassword) {
      setMessage("Passwords do not match. Please try again.");
      return;
    }

    try {
      const response = await axios.post(
        "https://learne5.onrender.com/auth/reset-password",
        {
          email: email,
          password: password,
        }
      );

      if (response.status === 200) {
        alert("Password has been reset successfully!");
        localStorage.removeItem("email");
        navigate("/login");
      } else {
        throw new Error("Failed to reset password.");
      }
    } catch (error) {
      alert("Error resetting password. Please try again.");
    }
  };

  const isSubmitDisabled = !Object.values(passwordRules).every(Boolean);

  return (
    <div className="reset-password-container">
      <div className="reset-password-box">
        <h1>Reset Password</h1>
        <p>Enter a new password for your account.</p>
        <form onSubmit={handleResetPassword}>
          <div className="password-field">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="New password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="input-password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="toggle-password-btn"
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
          <div className="password-rules">
            <p>Password must include:</p>
            <label>
              <input type="checkbox" checked={passwordRules.hasUppercase} readOnly />
              At least one uppercase letter [A-Z]
            </label>
            <label>
              <input type="checkbox" checked={passwordRules.hasLowercase} readOnly />
              At least one lowercase letter [a-z]
            </label>
            <label>
              <input type="checkbox" checked={passwordRules.hasDigit} readOnly />
              At least one digit [0-9]
            </label>
            <label>
              <input type="checkbox" checked={passwordRules.hasSpecialChar} readOnly />
              At least one special character [!@#$%^&*]
            </label>
            <label>
              <input type="checkbox" checked={passwordRules.hasValidLength} readOnly />
              Length between 8-12 characters
            </label>
          </div>
          <div className="password-field">
            <input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="input-password"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="toggle-password-btn"
            >
              {showConfirmPassword ? "Hide" : "Show"}
            </button>
          </div>
          <button type="submit" className="btn-submit" disabled={isSubmitDisabled}>
            Reset Password
          </button>
        </form>
        {message && <p className="message">{message}</p>}
      </div>
    </div>
  );
};

export default ResetPassword;