import React, { useState, useRef, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import "./LoginPage.css";
import axios from "axios";
import { toast } from "react-toastify";
import { AuthContext } from "../../context/AuthContext";

const LoginPage = () => {
  const { setAuth } = useContext(AuthContext); // To use AuthContext
  const userRef = useRef(); // Reference for focusing on username input
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

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
        theme: "dark",
      });
    } else if (!password) {
      setError("Password cannot be empty");
      toast("Password cannot be empty", {
        theme: "dark",
      });
    } else {
      // Call API to sign up the user
      axios
        .post("http://localhost:8500/api/v1/user-auth/login", {
          Email: username,
          Password: password,
        })
        .then((res) => {
          console.log("Login Success:", res.data);
          localStorage.setItem("token", res.data.token); // Store token in local storage
          navigate("/home"); // Redirect to dashboard
          setAuth(res.data.token); // Set token in context
        })
        .then(() => {
          toast("Login Successful", {
            theme: "dark",
          });
        })
        .catch((err) => {
          console.error("Login Error:", err);
          if (err.response && err.response.data && err.response.data.message) {
            toast(err.response.data.message, {
              theme: "dark",
            });
            setError(err.response.data.message);
          } else {
            // toast("An error occurred during login. Please try again.", {
            //   theme: "dark",
            // });
            setError("An error occurred during login. Please try again.");
          }
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
              type="ema"
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
              Login
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
