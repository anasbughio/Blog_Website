import { Link } from "react-router-dom";
import "../CSS/leftside.css";

const LeftSide = () => {
  return (
    <aside className="left-sidebar">
      {/* Logo / App Name */}
      <div className="sidebar-logo">
        <Link to="/posts">📝 MyBlog</Link>
      </div>

      {/* Navigation Links */}
      <nav className="sidebar-nav">
        <Link to="/posts" className="sidebar-link">✍️ Create Post</Link>
        <Link to="/getposts" className="sidebar-link">📰 All Posts</Link>
        <Link to="/profilepage" className="sidebar-link">👤 Profile</Link>
        <Link to="/bookmarks" className="sidebar-link">🔖 Bookmarks</Link>
      </nav>
    </aside>
  );
};

export default LeftSide;
