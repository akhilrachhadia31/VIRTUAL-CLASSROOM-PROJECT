import { Link, useNavigate } from "react-router-dom";
import styles from "./styles.module.css";
import { useState } from "react";
import axios from "axios";

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false); // State for button loading
  const navigate = useNavigate();

  const handleLogin = async () => {
    setLoading(true); // Start loading
    setMessage(""); // Reset any previous messages

    try {
      const response = await axios.post(
        "http://localhost:8080/auth/login", 
        { email, password },
        { withCredentials: true } // Ensure cookies are included
      );

      // Check if the response is valid
      if (response.status === 200 && response.data?.user) {
        const userData = response.data.user;

        // Store user data in localStorage
        localStorage.setItem('user', JSON.stringify(userData));

        setMessage('Login successful!');
        navigate("/home"); // Redirect to home
      } else {
        throw new Error('Invalid login response.');
      }
    } catch (error) {
      // Display appropriate error messages
      if (error.response && error.response.data) {
        setMessage(error.response.data.message || 'Login failed. Please try again.');
      } else {
        setMessage('An error occurred. Please check your network and try again.');
      }
    } finally {
      setLoading(false); // Stop loading
    }
  };

  const googleAuth = () => {
    window.open("http://localhost:8080/auth/google/callback", "_self");
	
  };

  return (
    <div className={styles.background}>
    <div className={styles.background_overlay}></div>
      <div className={styles.container}>
        <h1 className={styles.heading}>Learnify Log In</h1>
        <div className={styles.form_container}>
          <div className={styles.left}>
            <img className={styles.img} src="./images/left.jpeg" alt="login" />
          </div>
          <div className={styles.right}>
            <h2 className={styles.from_heading}>Users Log in</h2>
            <input
              type="text"
              className={styles.input}
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="password"
              className={styles.input}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Link to="/forget" className={styles.forgot_password}>
              Forgot Password?
            </Link>
            <button className={styles.btn} onClick={handleLogin} disabled={loading}>
              {loading ? "Logging in..." : "Log In"}
            </button>
            {message && <p className={styles.message}>{message}</p>}
            <p className={styles.text}>or</p>
            <button className={styles.google_btn} onClick={googleAuth}>
              <img src="./images/google.png" alt="google icon" />
              <span>Log in with Google</span>
            </button>
            <p className={styles.text}>
              New Here? <Link to="/signup">Sign Up</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
