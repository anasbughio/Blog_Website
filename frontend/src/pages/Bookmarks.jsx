import { useState, useEffect } from "react";
import axios from "../axiosConfig";
import { Link } from "react-router-dom";
import "../CSS/getPosts.css";

const API_URL = process.env.REACT_APP_API_URL || "";

const Bookmarks = () => {
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookmarks = async () => {
      try {
        const res = await axios.get("/bookmarks", { withCredentials: true });
        setBookmarks(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchBookmarks();
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <div className="posts-feed">
      {bookmarks.length === 0 ? (
        <p>No bookmarks yet.</p>
      ) : (
        bookmarks.map((bookmark) => (
          <div key={bookmark._id} className="post-card">
            
            {/* ✅ Post Image (external or upload) */}
            {bookmark.post.img && (
              <img
                src={
                  bookmark.post.img.startsWith("http")
                    ? bookmark.post.img
                    : `${API_URL}${bookmark.post.img}`
                }
                alt={bookmark.post.title}
                className="post-cover"
              />
            )}

            <div className="post-body">
              <div className="post-header">
                {/* ✅ Author Profile Pic (always from uploads folder unless default) */}
                <img
                  src={
                    bookmark.post.auther?.profilePic?.trim()
                      ? `${API_URL}${bookmark.post.auther.profilePic}`
                      : "/default-avatar.png"
                  }
                  alt={bookmark.post.auther?.username || ""}
                  className="post-avatar"
                />

                <div className="author-info">
                  <p className="author-name">{bookmark.post.auther?.username}</p>
                  <span className="post-date">
                    {new Date(bookmark.post.createdAt).toLocaleDateString("en-US", {
                      day: "2-digit",
                      month: "short",
                    })}
                  </span>
                </div>
              </div>

              {/* Post Title */}
              <Link to={`/posts/${bookmark.post._id}`} className="post-title">
                {bookmark.post.title}
              </Link>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default Bookmarks;
