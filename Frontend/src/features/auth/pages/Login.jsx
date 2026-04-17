import React, { useState } from "react";
import "../auth.form.scss";
import {useNavigate, Link} from 'react-router-dom'
import { useAuth } from "../hooks/useAuth";
import { auth, provider } from "../../../../firebase/firebase";
import { signInWithPopup, signOut } from "firebase/auth";

const Login = () => {
  const {loading, handleLogin, handleLoginWithGoogle} = useAuth()
  const navigate = useNavigate()
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const handleSubmit = async(e) => {
    e.preventDefault();
    await handleLogin({email, password})
    navigate('/home')
  };
   const handleLogin_Google = async () => {
      try {
        const result = await signInWithPopup(auth, provider);
        const user = result.user;
        await handleLoginWithGoogle({ username: user.displayName, email: user.email, password: "google_oauth" });
        console.log("User logged in successfully");
        navigate("/home");
      } catch (err) {
        console.log(err);
      }
    };
  if(loading){
    return (<main><h1>Loading...</h1></main>)
  }
  return (
    <main>
      <div className="form-container">
        <h1>Login</h1>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="email">Email</label>
            <input
              onChange={(e) => {setEmail(e.target.value)}}
              type="email"
              id="email"
              name="email"
              placeholder="Enter email address"
            />
          </div>
          <div className="input-group">
            <label htmlFor="password">Password</label>
            <input
              onChange={(e) => {setPassword(e.target.value)}}
              type="password"
              id="password"
              name="password"
              placeholder="Enter password"
            />
          </div>
          <button className="button primary-button">Login</button>
        </form>
         <div className="divider">
          <span>OR</span>
        </div>
        <button className="secondary-button" onClick={handleLogin_Google}>
         <img src="https://img.icons8.com/?size=100&id=4hR4Ih04Je2t&format=png&color=000000" height="25px" width="25px" alt="" />
          Google with Login</button>
        <p>Don't have an account? <Link to="/register">Register</Link></p>
      </div>
    </main>
  );
};

export default Login;
