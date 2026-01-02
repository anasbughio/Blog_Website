import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Logout from "../pages/Logout";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../CSS/navbar.css";

const Navbar = () => {
  const { isAuth, user } = useAuth();
 const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search/${query}`);
       setQuery(""); // clear input after search
    }
  };


  return (
    <nav className="navbar">
      <div className="navbar-left">
        <Link to="/getposts" className="logo">
          DevClone
        </Link>
      </div>

      <div className="navbar-center">
       
        {isAuth && (
          <>
            <Link to="/getposts" className="nav-link">
          Home
        </Link>
          <Link to="/posts" className="nav-link">
            ✍️ Create Post
          </Link>
         
        </>
        )}
      </div>

 {/* other nav links */}
    
      <div className="navbar-right">
        {isAuth ? (
          <>
            <form onSubmit={handleSearch} className="search-form">
        <input
          type="text"
          placeholder="Search blogs..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="search-input"
        />
        <button type="submit">🔍</button>
      </form>
            <span className="user-name">{user?.username}</span>
            <Logout />
          </>
        ) : (
          <>
            <Link to="/login" className="nav-link">
              Login
            </Link>
            <Link to="/register" className="nav-link">
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
