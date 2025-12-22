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

  // Step 1: Try signing in first (to detect existing account)
  const { error: signInError } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (!signInError) {
    alert("This email is already registered. Please log in instead.");
    navigate("/login");
    return;
  }

  // Step 2: Continue with sign-up
  const { data, error } = await supabase.auth.signUp({ email, password });

  if (error) {
    alert(error.message);
    return;
  }

  console.log("Signup success");
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

