import React, { useState } from "react";
import Swal from 'sweetalert2';
import "./Login.css"; // Reuse the same CSS as Login

const Register = () => {
  const [name, setName] = useState("");
  const [contactInfo, setContactInfo] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const registerData = {
      name: name,
      contact_info: contactInfo,
      email: email,
      username: username,
      password: password,
    };

    try {
      const response = await fetch("http://127.0.0.1:8000/api/tenant/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(registerData),
      });

      const result = await response.json();

      if (response.ok) {
        Swal.fire({
          icon: 'success',
          title: 'Success!',
          text: 'Registration successful!',
          confirmButtonText: 'OK',
        }).then(() => {
          window.location.href = "/";
        });
        console.log("Registration successful:", result);
      } else {
        setErrorMessage(result.message);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: result.message,
          confirmButtonText: 'OK',
        });
      }
    } catch (error) {
      console.error("Error during registration:", error);
      setErrorMessage("An error occurred. Please try again later.");
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'An error occurred. Please try again later.',
        confirmButtonText: 'OK',
      });
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h1>Register Form</h1>
        <p>Please register a new account</p>

        {errorMessage && <p className="error-message">{errorMessage}</p>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input
              type="text"
              id="name"
              name="name"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="contactInfo">Contact Info</label>
            <input
              type="text"
              id="contactInfo"
              name="contactInfo"
              placeholder="Enter your contact info"
              value={contactInfo}
              onChange={(e) => setContactInfo(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn">
            Register
          </button>
          <p className="login-link">
            Already have an account? <a href="/">Login</a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Register;