import React, { useState } from "react";
import { supabase } from "./supabaseClient.js";
import './Login.css'
import { useNavigate,Link } from "react-router-dom";

const Login = ({setCurrentUser}) =>{
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
     const [errorMessage, setErrorMessage] = useState("");
    const navigate = useNavigate();

    const handleLogin = async(e) =>{
        e.preventDefault();
        setErrorMessage("");
        const {data,error} = await supabase.auth.signInWithPassword({
            email,
            password
        })
        if(error){
            setErrorMessage(error.message)
            console.log(error.message)
        }
        else{
            console.log("Success")
            const user =  data.user ?? data.session?.user;
            setCurrentUser(user)
            navigate('/Dashboard')
        }
    }
 

    return(
        <>
            <div className="home-container">
                 <h2>Log In</h2>
                   <form onSubmit={handleLogin}>
                       <div className="login-box">
                             {errorMessage && (
        <p style={{ color: "red", marginTop: "8px" }}>{errorMessage}</p>
      )}
                           <label htmlFor="email">Username: </label>
                           <input
                                type='email'
                                id="email"
                                name="email"
                                value={email}
                                onChange={(e)=>setEmail(e.target.value)}
                                placeholder="Email... "
                           />
                           <label htmlFor="password">Password: </label>
                           <input
                                type="password"
                                id="password"
                                name="password"
                                value={password}
                                onChange={(e)=>setPassword(e.target.value)}
                                placeholder="Password..."
                           
                            />
                            <button type="submit">Login</button>
                            <p>Don't have an account?<Link to='/Signup'>Sign up</Link></p>
                       </div>
                   </form>
                
            </div>
        </>
    )
}
export default Login