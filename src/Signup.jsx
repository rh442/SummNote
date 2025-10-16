import React, { useState } from "react";
import { supabase } from "./supabaseClient.js";
import "./Signup.css";
import { useNavigate, Link } from "react-router-dom";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      if (error.status === 400 && error.message.includes("User already registered")) {
        alert("This email is already in use. Please log in instead.");
      } else {
        alert(error.message);
      }
      return;
    }

    console.log("Success");
    navigate("/confirmation");
  };

  return (
    <div className="home-container">
      <h2>Sign Up</h2>
      <form onSubmit={handleSignup}>
        <div className="login-box">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email..."
          />

          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password..."
          />

          <button type="submit">Sign up</button>
        </div>
      </form>

      <p>
        Already have an account? <Link to="/login">Log in</Link>
      </p>
    </div>
  );
};

export default Signup;
