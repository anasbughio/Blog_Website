import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "../axiosConfig";

const SearchResults = () => {
  const { query } = useParams();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const res = await axios.get(`/posts/search?title=${encodeURIComponent(query)}`);
        setResults(res.data);
      } catch (err) {
        console.error("Search error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchResults();
  }, [query]);

  if (loading) return <p>Loading...</p>;

  return (
    <div className="search-results">
      <h2>Search results for: "{query}"</h2>
      {results.length === 0 ? (
        <p>No posts found.</p>
      ) : (
        results.map((post) => (
          <div key={post._id} className="post-card">
            {post.img && <img src={post.img} alt={post.title} className="post-img" />}
            <Link to={`/posts/${post._id}`} className="post-title">
              {post.title}
            </Link>
            <p className="post-author">by {post.auther?.username}</p>
          </div>
        ))
      )}
    </div>
  );
};

export default SearchResults;
