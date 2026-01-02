import { useState, useEffect } from "react";
import axios from "../axiosConfig";
import { Link } from "react-router-dom";
import "../CSS/getPosts.css";

const API_URL =  process.env.REACT_APP_API_URL || "";

const GetPosts = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bookmarkedPosts, setBookmarkedPosts] = useState([]); // store bookmarked post IDs

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await axios.get("/posts");
        setPosts(res.data);

        // fetch bookmarks for the logged-in user
        const bookmarksRes = await axios.get("/bookmarks", { withCredentials: true });
        const bookmarkedIds = bookmarksRes.data.map((b) => b.post._id);
        setBookmarkedPosts(bookmarkedIds);
      } catch (err) {
        console.error("Error fetching posts or bookmarks:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  const toggleBookmark = async (postId) => {
    try {
      if (bookmarkedPosts.includes(postId)) {
        // remove bookmark
        await axios.delete(`/bookmarks/${postId}`, { withCredentials: true });
        setBookmarkedPosts((prev) => prev.filter((id) => id !== postId));
      } else {
        // add bookmark
        await axios.post(`/bookmarks/${postId}`, {}, { withCredentials: true });
        setBookmarkedPosts((prev) => [...prev, postId]);
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="posts-feed">
      {posts.length === 0 ? (
        <p>No posts found</p>
      ) : (
        posts.map((post) => (
          <div key={post._id} className="post-card">
            {/* ✅ Post Image (works with uploads + external links) */}
            {post.img && (
              <img
                src={post.img.startsWith("http") ? post.img : `${API_URL}${post.img}`}
                alt={post.title}
                className="post-cover"
              />
            )}

            <div className="post-body">
              <div className="post-header">
                {/* ✅ Author Profile Pic (always from uploads unless default) */}
                <img
                  src={
                    post.auther?.profilePic?.trim()
                      ? `${API_URL}${post.auther.profilePic}`
                      : "/default-avatar.png"
                  }
                  alt={post.auther?.username || ""}
                  className="post-avatar"
                />

                <div className="author-info">
                  <p className="author-name">{post.auther?.username}</p>
                  <span className="post-date">
                    {new Date(post.createdAt).toLocaleDateString("en-US", {
                      day: "2-digit",
                      month: "short",
                    })}
                  </span>
                </div>
              </div>

              {/* ✅ Only one Link (no nesting) */}
              <Link to={`/posts/${post._id}`} className="post-title">
                {post.title}
              </Link>

              {/* Bookmark Button */}
              <button
                className={`bookmark-btn ${bookmarkedPosts.includes(post._id) ? "bookmarked" : ""}`}
                onClick={() => toggleBookmark(post._id)}
              >
                {bookmarkedPosts.includes(post._id) ? "🔖 Bookmarked" : "🔖 Bookmark"}
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default GetPosts;
