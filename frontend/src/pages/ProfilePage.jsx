import { useState, useEffect } from "react";
import axios from "../axiosConfig";
import "../CSS/profilepage.css";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [profilePic, setProfilePic] = useState(""); // URL for display
  const [selectedFile, setSelectedFile] = useState(null); // actual file
  const API_URL = process.env.REACT_APP_API_URL || "";

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get("/auth/profile", { withCredentials: true });
        setUser(res.data.user);
        setPosts(res.data.posts || []);
        setProfilePic(
          res.data.user.profilePic?.trim()
            ? `${API_URL}${res.data.user.profilePic}`
            : "/default-avatar.png"
        );
      } catch (err) {
        console.error(err);
      }
    };
    fetchProfile();
  }, [API_URL]);

  // Show preview when user selects a file
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setProfilePic(previewUrl);
    }
  };

  const handlePicUpdate = async () => {
    if (!selectedFile) return alert("Please select a file first!");
    try {
      const formData = new FormData();
      formData.append("profilePic", selectedFile);

      const res = await axios.put("/auth/profile-pic-upload", formData, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      });

      setUser(res.data);
      setProfilePic(`${API_URL}${res.data.profilePic}`); // update with actual uploaded URL
      setSelectedFile(null);
      alert("✅ Profile picture updated!");
    } catch (err) {
      console.error(err);
      alert("❌ Failed to upload profile picture");
    }
  };

  if (!user) return <p className="loading">Loading...</p>;

  return (
    <div className="profile-page-container">
      {/* Sidebar */}
      <div className="profile-sidebar">
        <img
          src={profilePic.startsWith("blob:") ? profilePic : profilePic}
          alt={user?.username}
          className="profile-avatar"
        />
        <h2 className="profile-name">{user.username}</h2>
        <p className="profile-email">{user.email}</p>

        <div className="update-pic">
          <input type="file" accept="image/*" onChange={handleFileChange} />
          <button onClick={handlePicUpdate}>Upload Picture</button>
        </div>

        <div className="sidebar-links">
          <a href="/create-post">✍️ Create Post</a>
          <a href="/getposts">📝 My Posts</a>
          <a href="/profilepage">👤 Profile</a>
        </div>
      </div>

      {/* Right Content: User Blogs */}
      <div className="profile-content">
        <h3>📝 My Blogs</h3>
        {posts.length === 0 ? (
          <p>No posts yet.</p>
        ) : (
          posts.map((post) => (
            <div key={post._id} className="post-card">
              {post.img && (
                <img
                  src={post.img} // no API_URL here since posts use external links
                  alt={post.title}
                  className="post-cover"
                />
              )}
              <h4>{post.title}</h4>
              <p>{post.content.slice(0, 150)}...</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Profile;
