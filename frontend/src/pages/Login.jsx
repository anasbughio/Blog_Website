import { useState } from "react";
import axios from "../axiosConfig";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../CSS/login.css"; // Import dark theme styles

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { setIsAuth } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        "/auth/login",
        { email, password },
        { withCredentials: true }
      );
      setIsAuth(true);
      navigate("/getposts"); // go to posts after login
    } catch (error) {
      console.error(error);
      alert("❌ Login failed. Check email/password.");
    }
  };

  return (
    <div className="login-container">
      <form onSubmit={handleLogin} className="login-form">
        <h2 className="login-title">🔑 Login</h2>

        <input
          type="email"
          placeholder="Enter your email..."
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="login-input"
        />

        <input
          type="password"
          placeholder="Enter your password..."
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="login-input"
        />

        <button type="submit" className="login-btn">
          🚀 Login
        </button>
        <p className="signup-text">
  Don’t have an account? <a href="/register">Sign up</a>
</p>
      </form>
    </div>
  );
};

export default Login;
