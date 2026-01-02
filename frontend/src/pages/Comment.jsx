import { useState, useEffect } from "react";
import axios from "../axiosConfig";
import { useAuth } from "../context/AuthContext";
import "../CSS/postsDetails.css"

const Comments = ({ postId }) => {
  const { user, isAuth } = useAuth();
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");

  useEffect(() => {
    const fetchComments = async () => {
      const res = await axios.get(`/comments/${postId}`);
      setComments(res.data);
    };
    fetchComments();
  }, [postId]);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    const res = await axios.post(`/comments/${postId}`, { content: newComment }, { withCredentials: true });
    setComments([res.data, ...comments]);
    setNewComment("");
  };

  const handleDelete = async (id) => {
    await axios.delete(`/comments/${id}`, { withCredentials: true });
    setComments(comments.filter((c) => c._id !== id));
  };

  return (
    <div className="comments comment-section">
      <h3>Comments</h3>

      {isAuth && (
        <form onSubmit={handleAdd}>
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Write a comment..."
          
          />
          <button type="submit">Add Comment</button>
        </form>
      )}

      {comments.map((c) => (
        <div key={c._id} className="comment comment-item">
          <p><strong>{c.auther.username}</strong>: {c.content}</p>
          {user && c.auther._id === user._id && (
            <button onClick={() => handleDelete(c._id)} className="delete-btn"> 🗑️</button>
          )}
        </div>
      ))}
    </div>
  );
};

export default Comments;
