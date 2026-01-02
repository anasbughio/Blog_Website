import { useEffect, useState } from "react";
import axios from "../axiosConfig";

const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get("/auth/me", { withCredentials: true });
        console.log("Fetched user from /auth/me:", res.data); // 👈 check here
        setUser(res.data);
      } catch (err) {
        console.error("Not logged in", err);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  return { user, loading };
};

export default useAuth;
