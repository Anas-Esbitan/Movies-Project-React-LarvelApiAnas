import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "../assets/css/Register.css";
const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    c_password: "",
  });

  const [validationErrors, setValidationErrors] = useState({});
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const validateField = (field, value) => {
    const errors = { ...validationErrors };

    if (field === "name" && !value.trim()) {
      errors.name = "Name is required.";
    } else if (
      field === "email" &&
      (!value.trim() || !/\S+@\S+\.\S+/.test(value))
    ) {
      errors.email = "Invalid email format.";
    } else if (field === "password" && value.length < 6) {
      errors.password = "Password must be at least 6 characters.";
    } else if (field === "c_password" && value !== formData.password) {
      errors.c_password = "Passwords do not match.";
    } else {
      delete errors[field];
    }

    setValidationErrors(errors);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    validateField(name, value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    if (Object.keys(validationErrors).length > 0) {
      setError("Please fix the validation errors.");
      setIsLoading(false);
      return;
    }

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/register",
        formData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const token = response.data.data.token;
      console.log(`token: ${token}`);
      console.log(`name: ${response.data.data.name}`);
      

      if (token) {
        localStorage.setItem("authToken", token); 
        localStorage.setItem("name", response.data.data.name);
      }
      
      window.history.back();
    } catch (error) {
      if (error.response && error.response.data) {
        setError(
          error.response.data.message ||
            "Registration failed. Please try again."
        );
      } else {
        setError("An unexpected error occurred.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="register">
    <div className="card2">
      <div className="right">
        <h1>Register</h1>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
          />
          {validationErrors.name && (
            <p className="error">{validationErrors.name}</p>
          )}

          <input
            type="email"
            placeholder="Email"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />
          {validationErrors.email && (
            <p className="error">{validationErrors.email}</p>
          )}

          <input
            type="password"
            placeholder="Password"
            name="password"
            value={formData.password}
            onChange={handleChange}
          />
          {validationErrors.password && (
            <p className="error">{validationErrors.password}</p>
          )}

          <input
            type="password"
            placeholder="Confirm Password"
            name="c_password"
            value={formData.c_password}
            onChange={handleChange}
          />
          {validationErrors.c_password && (
            <p className="error">{validationErrors.c_password}</p>
          )}
           {error && <p style={{  color: '#dc3545'}}>{error}</p>}
          <div className="btn-register"> 
            <button type="submit" disabled={isLoading}>
               {isLoading ? "Registering..." : "Register"}
            </button>
          </div>
          <div className="text-center mt-3">
          <p style={{color:'#121826'}}>
        Do you already have an account?{" "}
          <Link to="/login" className="text-primary">
          Login here
          </Link>
        </p>
      </div>
        </form>
       
      </div>
    </div>
  </div>
  );
};

export default Register;
