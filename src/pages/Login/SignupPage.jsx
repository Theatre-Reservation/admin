import React, { useState } from "react";
import "./SignupPage.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const SignupPage = () => {
  const navigate = useNavigate();
  const [error, setError] = useState(""); // Error state
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.username) {
      setError("Username cannot be empty");
    } else if (!formData.password) {
      setError("Password cannot be empty");
    } else {
      console.log("dsf");
      axios
        .post("http://localhost:8500/api/v1/user-auth/signup", {
          Name: formData.username,
          Email: formData.email,
          Password: formData.password,
          isAdmin: true,
        })
        .then((res) => {
          console.log("Sign Up Success:", res.data);
          navigate("/");
        })
        .catch((err) => {
          console.error("Sign Up Error:", err);
          // setError('An error occurred during sign-up. Please try again.');
          if (err.response && err.response.data && err.response.data.message) {
            setError(err.response.data.message);
          } else {
            setError("An error occurred during sign-up. Please try again.");
          }
        });
    }
    // Handle form submission logic here
    // console.log(formData);
  };

  return (
    <div className="signup-container">
      <div className="form-box">
        <h1>Sign Up</h1>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
            />
            <label>Username</label>
          </div>
          <div className="input-group">
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <label>Email</label>
          </div>
          <div className="input-group">
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
            <label>Password</label>
          </div>
          <div className="input-group">
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
            <label>Confirm Password</label>
          </div>
          <button type="submit" className="signup-btn">
            Create Account
          </button>
        </form>
        <p>
          Already have an account? <a href="/">Login here</a>
        </p>
      </div>
    </div>
  );
};

export default SignupPage;
