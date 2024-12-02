import { Link, useNavigate } from "react-router-dom";
import styles from "./styles.module.css";
import { useState } from "react";
import axios from "axios";

function Signup() {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [type, setRole] = useState('');
    const [message, setMessage] = useState('');

    // Email validation state
    const [isEmailValid, setIsEmailValid] = useState(true);

    // Password validation states
    const [passwordRules, setPasswordRules] = useState({
        hasUppercase: false,
        hasLowercase: false,
        hasDigit: false,
        hasSpecialChar: false,
        hasValidLength: false,
    });

    // Validate email format
    const validateEmail = (value) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        setIsEmailValid(emailRegex.test(value));
    };

    const handlePasswordChange = (value) => {
        setPassword(value);

        // Update password rules based on current input
        setPasswordRules({
            hasUppercase: /[A-Z]/.test(value),
            hasLowercase: /[a-z]/.test(value),
            hasDigit: /\d/.test(value),
            hasSpecialChar: /[!@#$%^&*]/.test(value),
            hasValidLength: value.length >= 8 && value.length <= 12,
        });
    };

    const handleSignup = async (event) => {
        event.preventDefault();

        // Check if any field is empty
        if (!username || !email || !password || !type) {
            alert("Please fill in all the fields.");
            return;
        }

        // Check if the email is valid
        if (!isEmailValid) {
            alert("Please enter a valid email address.");
            return;
        }

        // Ensure all password rules are satisfied
        const allRulesSatisfied = Object.values(passwordRules).every((rule) => rule);
        if (!allRulesSatisfied) {
            alert("Password must satisfy all constraints");
            return;
        }

        try {
            const response = await axios.post("https://learne5.onrender.com/auth/signup", {
                email,
                username,
                password,
                type,
            });
            console.log("hi from response");
            console.log(response);
            if (response.status === 200) {
                setMessage('Authenticating your email....');
                alert('Verification email sent successfully!'); // Alert message for successful verification email
                navigate('/verify'); // Redirect to verify email page
            }
        } catch (error) {
            // If the error is due to username already existing, it will show that message
            if (error.response?.data?.message === "User already exists with this email or username") {
                alert(error.response?.data?.message); // Show the alert message if username exists
            }
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleSignup();
        }
    };

    return (
        <div className={styles.background}>
            <div className={styles.container}>
                <h1 className={styles.heading}>Learnify Sign Up</h1>
                <div className={styles.form_container}>
                    <div className={styles.left}>
                        <img className={styles.img} src="./images/left.jpeg" alt="signup" />
                    </div>
                    <div className={`${styles.right} ${styles.form_right}`}>
                        <h2 className={styles.from_heading}>Create Account</h2>
                        <input
                            type="text"
                            className={styles.input}
                            placeholder="Username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            onKeyDown={handleKeyDown} 
                        />
                        <input
                            type="email"
                            className={`${styles.input} ${isEmailValid ? '' : styles.invalid}`}
                            placeholder="Email"
                            value={email}
                            onChange={(e) => {
                                setEmail(e.target.value);
                                validateEmail(e.target.value);
                            }}
                            onKeyDown={handleKeyDown} // Listen for Enter key press
                        />
                        {!isEmailValid && <p className={styles.error}>Please enter a valid email.</p>}
                        <input
                            type="password"
                            className={styles.input}
                            placeholder="Password"
                            value={password}
                            onChange={(e) => handlePasswordChange(e.target.value)}
                            onKeyDown={handleKeyDown}
                        />
                        <div className={styles.password_rules}>
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
                        <select
                            className={styles.dropdown}
                            value={type}
                            onChange={(e) => setRole(e.target.value)}
                        >
                            <option value="" disabled>Select Role</option>
                            <option value="student">Student</option>
                            <option value="teacher">Teacher</option>
                        </select>

                        <button onClick={handleSignup} className={styles.btn}>
                            Sign Up
                        </button>

                        <p className={styles.text}>
                            Already have an account? <Link to="/login">Login</Link>
                        </p>
                        <p className={styles.text}>
                            {message && <span>{message}</span>}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Signup;
