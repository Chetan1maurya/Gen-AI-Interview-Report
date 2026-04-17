import React,{useState} from "react";
import "../auth.form.scss";
import {useAuth} from '../hooks/useAuth'
import {useNavigate, Link} from 'react-router-dom'
import { auth, provider } from "../../../../firebase/firebase";
import { signInWithPopup, signOut } from "firebase/auth";

const Register = () => {
  const navigate = useNavigate()
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const {loading, handleRegister, handleLoginWithGoogle} = useAuth()

  const handleSubmit = async(e) => {
    e.preventDefault();
    await handleRegister({username, email, password})
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
        <h1>Register</h1>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="username">Username</label>
            <input
              onChange={(e) => {setUsername(e.target.value)}}
              type="username"
              id="username"
              name="username"
              placeholder="Enter username"
            />
          </div>
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
          <button className="button primary-button">Register</button>
        </form>
        <div className="divider">
          <span>OR</span>
        </div>
        <button className="secondary-button" onClick={handleLogin_Google}>
         <img src="https://img.icons8.com/?size=100&id=4hR4Ih04Je2t&format=png&color=000000" height="25px" width="25px" alt="" />
          Google with Login</button>
        <p>Already have an account? <Link to="/login">Login</Link></p>
      </div>
    </main>
  );
};

export default Register;
