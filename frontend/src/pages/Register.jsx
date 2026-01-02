import { useState } from "react";
import axios from "../axiosConfig";
import "../CSS/register.css"; // 🔥 Import dark theme CSS
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
const { setIsAuth, setUser } = useAuth();
const navigate = useNavigate();
  const registerUser = async (e) => {
    e.preventDefault();
    try {
    const res =   await axios.post(
        "/auth/register",
        { username, email, password },
        { withCredentials: true }
      );
        setIsAuth(true);
        setUser(res.data.user); // 👈 backend should return user info
      setUsername("");
      setEmail("");
      setPassword("");
      navigate('/getposts')
  
      alert("✅ Registration successful! You can now log in.");
    } catch (err) {
      console.error(err.response?.data || err.message);
      alert(err.response?.data?.message || "❌ Registration failed");
    }
  };

  return (
    <div className="register-container">
    <form onSubmit={registerUser} className="register-form">
  <h2 className="register-title">📝 Register</h2>

  <input
    type="text"
    placeholder="Enter your username..."
    value={username}
    onChange={(e) => setUsername(e.target.value)}
    className="register-input"
  />

  <input
    type="email"
    placeholder="Enter your email..."
    value={email}
    onChange={(e) => setEmail(e.target.value)}
    className="register-input"
  />

  <input
    type="password"
    placeholder="Enter your password..."
    value={password}
    onChange={(e) => setPassword(e.target.value)}
    className="register-input"
  />

  <button type="submit" className="register-btn">
    🚀 Register
  </button>

  <p className="login-text">
    Already have an account? <Link to="/login">Login</Link>
  </p>
</form>

     
    </div>
  );
};

export default Register;
