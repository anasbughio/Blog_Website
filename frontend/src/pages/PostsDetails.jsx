import { useEffect, useState } from "react";
import axios from "../axiosConfig";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../CSS/postsDetails.css";
import Comments from "./Comment";

const PostsDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [img, setImg] = useState("");
  const { user, isAuth } = useAuth();
  const API_URL = process.env.REACT_APP_API_URL || "";

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await axios.get(`/posts/${id}`, { withCredentials: true });
        setPost(res.data);
      } catch (error) {
        console.error("Error fetching post:", error);
      }
    };
    fetchPost();
  }, [id]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!post?._id) return console.error("Post ID missing");

    try {
      await axios.put(
        `/posts/${id}`,
        { title, content, img },
        { withCredentials: true }
      );
      setPost((prev) => ({ ...prev, title, content, img }));
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating post:", error);
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      try {
        await axios.delete(`/posts/${post._id}`, { withCredentials: true });
        alert("✅ Post deleted successfully!");
        navigate("/getposts"); // redirect after deletion
      } catch (err) {
        console.error("Error deleting post:", err);
        alert("❌ Failed to delete post");
      }
    }
  };

  if (!post) return <p className="loading">Loading...</p>;

  return (
    <div className="post-details">
      {isEditing ? (
        <form onSubmit={handleUpdate} className="edit-form">
          <h2>Edit Post</h2>
          <input
            type="text"
            value={title}
            placeholder="Title"
            onChange={(e) => setTitle(e.target.value)}
            className="edit-input"
          />
          <textarea
            value={content}
            placeholder="Content"
            onChange={(e) => setContent(e.target.value)}
            className="edit-input"
            rows="5"
          />
          <input
            type="text"
            value={img}
            placeholder="Image URL or Upload Path"
            onChange={(e) => setImg(e.target.value)}
            className="edit-input"
          />
          <div className="edit-actions">
            <button type="submit" className="btn save-btn">💾</button>
            <button
              type="button"
              className="btn cancel-btn"
              onClick={() => setIsEditing(false)}
            >
              ❌
            </button>
          </div>
        </form>
      ) : (
        <div className="post-card">
          {/* Edit & Delete buttons (only if owner) */}
          {isAuth && user && post.auther?._id === user._id && (
            <div className="post-actions">
              <button
                className="btn edit-btn"
                onClick={() => {
                  setIsEditing(true);
                  setTitle(post.title);
                  setContent(post.content);
                  setImg(post.img || "");
                }}
              >
                ✏️
              </button>
              <button className="btn delete-btn" onClick={handleDelete}>🗑️</button>
            </div>
          )}

          {/* Author Info */}
          <div className="author-info">
            <img
              src={
                post.auther?.profilePic?.trim()
                  ? post.auther.profilePic.startsWith("http")
                    ? post.auther.profilePic
                    : `${API_URL}${post.auther.profilePic}`
                  : "/default-avatar.png"
              }
              alt={post.auther?.username || "Author"}
              className="author-pic"
            />
            <div>
              <p className="author-name">{post.auther?.username}</p>
              <p className="post-date">
                {new Date(post.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>

          {/* Post Image */}
          {post.img && (
            <img
              src={
                post.img.startsWith("http")
                  ? post.img
                  : `${API_URL}${post.img}`
              }
              alt={post.title}
              className="post-img"
            />
          )}

          {/* Post Content */}
          <h2 className="post-title">{post.title}</h2>
          <p className="post-content">{post.content}</p>

          {/* Comments Section */}
          <div className="comments-section">
            <h3>💬 Discussion</h3>
            <Comments postId={post._id} />
          </div>
        </div>
      )}
    </div>
  );
};

export default PostsDetails;
