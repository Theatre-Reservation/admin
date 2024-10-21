import React, { useState, useRef, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import "./LoginPage.css";
import axios from "axios";
import { toast } from "react-toastify";
import { AuthContext } from "../../context/AuthContext";
import Spinner from "../../components/Spinner/spinner";

const LoginPage = () => {
  const { setAuth } = useContext(AuthContext); // To use AuthContext
  const userRef = useRef(); // Reference for focusing on username input
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    userRef.current.focus();
  }, []);

  useEffect(() => {
    setError(""); // Reset error when username or password changes
  }, [username, password]);

  const navigate = useNavigate();

  // Form submit handler
  const handleSignIn = async (event) => {
    event.preventDefault(); // Prevent default form submission behavior

    if (!username) {
      setError("Username cannot be empty");
      toast("Username cannot be empty", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        newestOnTop: false,
        closeOnClick: true,
        rtl: false,
        pauseOnFocusLoss: true,
        draggable: true,
        pauseOnHover: true,
        theme: "dark",
      });
    } else if (!password) {
      setError("Password cannot be empty");
      toast("Password cannot be empty", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        newestOnTop: false,
        closeOnClick: true,
        rtl: false,
        pauseOnFocusLoss: true,
        draggable: true,
        pauseOnHover: true,
        theme: "dark",
      });
    } else {
      // Call API to sign up the user
      setLoading(true),
        axios
          .post(
            "https://auth-service1-bkdhfbh9a3a2g4ba.canadacentral-01.azurewebsites.net/api/v1/user-auth/login",
            {
              Email: username,
              Password: password,
            }
          )
          .then((res) => {
            console.log("Login Success:", res.data);
            localStorage.setItem("token", res.data.token); // Store token in local storage
            navigate("/home"); // Redirect to dashboard
            setAuth(res.data.token); // Set token in context
          })
          // .then(() => {
          //   toast("Login Successful", {
          //     theme: "dark",
          //   });
          // })
          .catch((err) => {
            // console.error("Login Error:", err);
            if (
              err.response &&
              err.response.data &&
              err.response.data.message
            ) {
              toast(err.response.data.message, {
                theme: "dark",
              });
              setError(err.response.data.message);
            } else {
              setError("An error occurred during login. Please try again.");
            }
          })
          .finally(() => {
            setLoading(false);
          });
    }
  };

  return (
    <div className="login-container">
      <div className="login-form">
        <h2>Login to Flash Ticket</h2>
        <form onSubmit={handleSignIn}>
          {error && <div className="error-message">{error}</div>}

          <div className="input-group">
            <label htmlFor="username">Email</label>
            <input
              type="email"
              id="email"
              ref={userRef}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your Email"
            />
          </div>

          <div className="input-group">
            <label htmlFor="password">Password</label>
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
            />
            <span
              className="toggle-password"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? "Hide" : "Show"}
            </span>
          </div>

          <div className="submit-group">
            <button type="submit" className="login-button">
              {loading ? <Spinner size="20px" /> : "Login"}
            </button>
          </div>

          <div className="register-link">
            Don't have an account?{" "}
            <span onClick={() => navigate("/register")}>Register here</span>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
