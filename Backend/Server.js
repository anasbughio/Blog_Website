const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const authRoutes = require("./routes/authRoutes");
const postsRoute = require("./routes/postsRoute");
const authMiddleware = require('./middlewares/authMiddlewares');
const cookieParser = require('cookie-parser');
const commentRoutes = require('./routes/commentRoutes');
const bookmarkRoutes = require('./routes/bookMarkRoutes');
const path = require("path");

const app  = express();

dotenv.config();
app.use(cors({
  origin: ['http://localhost:3000', process.env.CLIENT_URL ||  "http://localhost:3000" ],// frontend URL
  credentials: true // ✅ allow sending cookies
}));
app.set("trust proxy", 1);
app.use(express.json());
app.use(cookieParser());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/api/auth",authRoutes);
app.get("/api/auth/check", authMiddleware, (req, res) => {
res.json({ authenticated: true });
});
app.use("/api/posts",authMiddleware,postsRoute);
app.use('/api/bookmarks', bookmarkRoutes);
app.use("/api/comments",commentRoutes);



mongoose.connect(process.env.MONGO_URI)
.then(()=>{
    app.listen(process.env.PORT, () => {
        console.log(`Server is running on port ${process.env.PORT}`);
    });
})
.catch((error) => {
    console.error('Database connection error:', error);
}); 
