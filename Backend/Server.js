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

// Serverless wrapper for Vercel
let serverless;
try {
    serverless = require('serverless-http');
} catch (e) {
    serverless = null;
}

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

// support either MONGO_URI or MONGODB_URI environment variable
const mongoUri = process.env.MONGO_URI || process.env.MONGODB_URI;

mongoose.connect(mongoUri)
    .then(() => {
        // when running locally via `node Server.js` we want to listen
        if (require.main === module) {
            const port = process.env.PORT || 5000;
            app.listen(port, () => {
                console.log(`Server is running on port ${port}`);
            });
        } else {
            console.log('Connected to database (serverless mode)');
        }
    })
    .catch((error) => {
        console.error('Database connection error:', error);
    });

// Export serverless handler for Vercel; fall back to app for local use
if (serverless) {
    module.exports = serverless(app);
} else {
    module.exports = app;
}
