import { Routes, Route } from "react-router-dom";
// import { useEffect, useState } from "react";
// import axios from "axios";
// import Cookies from "js-cookie";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import VerifyOtp from "./pages/VerifyOTP/VerifyOtp";
import ForgotPassword from "./pages/ForgotPassword/ForgotPassword";
import ResetPassword from "./pages/resetpassword/reset.jsx";
import "./App.css";

function App() {
//   const [user, setUserDetails] = useState(null);  // State to store user details
//   const [loading, setLoading] = useState(true);   // State for loading state
//   const [error, setError] = useState(null);       // State for error handling

//   // Fetch user details from the server
//   const fetchUserDetails = async () => {
//     try {
//       setLoading(true); // Start loading
//       const token = Cookies.get("token"); // Retrieve the token from cookies
//       console.log("Token:", token);

//       if (!token) {
//         setUserDetails(null);  // No token, so no authenticated user
//         setError(null); // Reset error if token is missing
//         setLoading(false); // Stop loading
//         return;
//       }

//       const response = await axios.get("http://localhost:8080/auth/check-auth", {
//         headers: {
//           Authorization: `Bearer ${token}`, // Include the token in the Authorization header
//         },
//       });

//       console.log("Response:", response);

//       if (response.status === 200) {
//         setUserDetails(response.data.user); // Update user details
//       } else {
//         setUserDetails(null);  // Reset user if response is not valid
//         setError("Failed to fetch user details");
//       }
//     } catch (error) {
//       console.error("Error fetching user details:", error);
//       setError("Error fetching user details");
//     } finally {
//       setLoading(false); // End loading
//     }
//   };

//   useEffect(() => {
//     fetchUserDetails(); // Fetch user details when the app loads
//   }, []);

//   console.log(user);

  return (
    <div className="container">
        <Routes>
          <Route
            path="/"
			element = {<Login/>}
          />
          <Route
            path="/home"
            element={<Home/>}
          />
          <Route
            exact
            path="/login"
            element={<Login />}
          />
          <Route
            path="/signup"
            element={<Signup />}
          />
          <Route
            path="/verify"
            element={<VerifyOtp />}
          />
          <Route
            path="/forget"
            element={<ForgotPassword />}
          />
          <Route
            path="/reset"
            element={<ResetPassword />}
          />
        </Routes>
    </div>
  );
}

export default App;
