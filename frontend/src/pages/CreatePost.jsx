import { useState } from "react";
import axios from "../axiosConfig";
import "../CSS/createPost.css"; // Import dark theme CSS
import { useNavigate } from "react-router-dom";
const CreatePost = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [img, setImg] = useState("");
const navigate = useNavigate();
  const createPost = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        "/posts",
        { title, content, img },
        { withCredentials: true }
      );
      alert("✅ Post created successfully!");
      navigate('/getposts');
      setTitle("");
      setContent("");
      setImg("");

    } catch (error) {
      console.error(error);
      alert("❌ Failed to create post");
    }
  };

  return (
    <div className="create-post-container">
      
      <form onSubmit={createPost} className="create-post-form">
        <h2 className="form-title">✍️ Create a New Post</h2>

        <input
          type="text"
          placeholder="Enter post title..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="form-input"
        />

        <textarea
          placeholder="Write your content here..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="form-textarea"
        ></textarea>

        <input
          type="text"
          placeholder="Image URL..."
          value={img}
          onChange={(e) => setImg(e.target.value)}
          className="form-input"
        />

        <button type="submit" className="submit-btn">
          🚀 Create Post
        </button>
      </form>
    </div>
  );
};

export default CreatePost;
