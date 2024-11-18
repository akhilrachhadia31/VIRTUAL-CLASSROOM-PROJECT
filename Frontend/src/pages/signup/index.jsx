import { Link, useNavigate } from "react-router-dom";
import styles from "./styles.module.css";
import { useState } from "react";
import axios from "axios";

function Signup() {
	const navigate = useNavigate();
	const [name, setUsername] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [role, setRole] = useState('');
	const [message, setMessage] = useState('');

	const handleSignup = async (event) => {
		event.preventDefault(); // Prevent page reload on form submission
		console.log(email, name, password, role);
	
		try {
			// Create FormData object and append the fields
			// const formData = new FormData();
			// formData.append("name", name);
			// formData.append("email", email);
			// formData.append("password", password);
			// formData.append("role", role);
			// console.log(formData);
	
			const response = await axios.post("http://localhost:8080/auth/signup", {
				email,
				name,
				password,
				role
			});
			// const data = await response.json();
			console.log(response)
	
			if (response.status !== 201) {
				throw new Error('Signup failed. Please try again.');
			}
	
			setMessage('Signup successful! Redirecting...');
			navigate('/verify'); // Redirect to verify email page
	
		} catch (error) {
			setMessage(error.message);
		}
	};
	

	return (
		<div className={styles.background}>
		<div className={styles.background_overlay}></div>
			<div className={styles.container}>
				<h1 className={styles.heading}>Learnify Sign Up</h1>
				<div className={styles.form_container}>
					<div className={styles.left}>
						<img className={styles.img} src="./images/left.jpeg" alt="signup" />
					</div>
					<div className={styles.right}>
						<h2 className={styles.from_heading}>Create Account</h2>
						<input
							type="text"
							className={styles.input}
							placeholder="Username"
							value={name}
							onChange={(e) => setUsername(e.target.value)}
						/>
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

						{/* Dropdown for Student or Teacher */}
						<select
							className={styles.dropdown}
							value={role}
							onChange={(e) => setRole(e.target.value)}
						>
							<option value="" disabled>Select Role</option>
							<option value="student">Student</option>
							<option value="teacher">Teacher</option>
						</select>

						<button className={styles.btn} onClick={handleSignup}>
							Sign Up
						</button>
						{message && <p className={styles.message}>{message}</p>}
						<p className={styles.text}>
							Already Have an Account? <Link to="/login">Log In</Link>
						</p>
					</div>
				</div>
			</div>
		</div>
	);
}

export default Signup;
