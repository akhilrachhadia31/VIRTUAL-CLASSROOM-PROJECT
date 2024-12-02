import { Link, useNavigate } from "react-router-dom";
import styles from "./styles.module.css";
import { useState } from "react";
import axios from "axios";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false); // State for button loading
  const navigate = useNavigate();

  const handleLogin = async () => {
    setLoading(true); // Start loading
    setMessage(""); // Reset any previous messages

    try {
      const response = await axios.post(
        "https://learne5.onrender.com/auth/login",
        { email, password },
        { withCredentials: true } // Ensure cookies are included
      );

      console.log(response);

      // Check if the response is valid
      if (response.status === 200 && response.data?.user) {
        const userData = response.data.user;
        const token = response.data.token;

        // Store user data in localStorage
        localStorage.setItem("user", JSON.stringify(userData));
        localStorage.setItem("token", token);
        localStorage.setItem("isloggedin", true);

        alert("Login successful!");
        window.location.reload("/home");
        navigate("/home"); // Redirect to home
      } else {
        throw new Error("Invalid login response.");
      }
    } catch (error) {
      // Check if the error is related to incorrect credentials
      if (error.response && error.response.data) {
        // If the email or password is incorrect or not found
        if (error.response.data.message === "Invalid credentials") {
          alert("Email or password is incorrect or any field is empty");
        } else {
          alert("Email or password is incorrect or any field is empty");
        }
      } else {
        alert("please check your network");
      }
    } finally {
      setLoading(false); // Stop loading
    }
  };

  const googleAuth = () => {
    try {
      // Open the Google OAuth popup
      const authWindow = window.open(
        "https://learne5.onrender.com/auth/google/callback",
        "_blank",
        "width=500,height=600"
      );

      // Add a message event listener to handle messages from the popup
      const messageListener = (event) => {
        if (event.origin !== "https://learne5.onrender.com") {
          console.error(
            "Received message from an unknown origin:",
            event.origin
          );
          return;
        }

        const { user, token } = event.data;

        if (user && token) {
          // Store the token and user in localStorage
          localStorage.setItem("user", JSON.stringify(user));
          localStorage.setItem("token", token);

          // Redirect to the home page
          window.location.href = "/home";
        } else {
          alert("Authentication failed. Please try again.");
        }

        // Remove the listener after processing the message
        window.removeEventListener("message", messageListener);
      };

      // Attach the message listener
      window.addEventListener("message", messageListener);
    } catch (error) {
      console.error("Error during Google authentication:", error);
      alert(
        "An error occurred during Google authentication. Please try again."
      );
    }
  };

  return (
    <div className={styles.background}>
      <div className={styles.container}>
        {/* Learnify Heading */}
        <h1 className={styles.heading}>Learnify Log In</h1>

        {/* Login Form Container */}
        <div className={styles.form_container}>
          {/* Left Section with Image */}
          <div className={styles.left}>
            <img
              className={styles.img}
              src="./images/left.jpeg"
              alt="login illustration"
            />
          </div>

          {/* Right Section with Form */}
          <div className={styles.right}>
            <h2 className={styles.from_heading}>Welcome Back!</h2>

            {/* Email Input */}
            <input
              type="email"
              className={styles.input}
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            {/* Password Input */}
            <input
              type="password"
              className={styles.input}
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            {/* Forgot Password */}
            <Link to="/forget" className={styles.forgot_password}>
              Forgot Password?
            </Link>

            {/* Login Button */}
            <button
              className={styles.btn}
              onClick={handleLogin}
              disabled={loading}
            >
              {loading ? "Logging in..." : "Log In"}
            </button>

            {/* Display Message */}
            {message && <p className={styles.message}>{message}</p>}

            {/* Divider */}
            <p className={styles.text}>or</p>

            {/* Google Login Button */}
            <button className={styles.google_btn} onClick={googleAuth}>
              <img
                src="./images/google.png"
                alt="Google icon"
                className={styles.google_icon}
              />
              <span>Log in with Google</span>
            </button>

            {/* Sign Up Link */}
            <p className={styles.text}>
              New here? <Link to="/signup">Sign Up</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;