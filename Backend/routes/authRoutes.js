const express = require('express');
const {register, loginUser,logoutUser, me, userProfile, getUserPic} = require("../controllers/authController");
const authMiddleware = require('../middlewares/authMiddlewares');
const router = express.Router();
const multer = require("multer");
const path = require("path");

// Multer configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // folder to store uploaded images
  },
  filename: function (req, file, cb) {
    cb(null, req.user.userId + "-" + Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({
  storage,
  fileFilter: function (req, file, cb) {
    if (file.mimetype.startsWith("image/")) cb(null, true);
    else cb(new Error("Only image files are allowed"), false);
  },
});
router.post('/register',register);
router.post('/login',loginUser);
router.post("/logout", logoutUser);
router.get("/me", authMiddleware, me);
router.put('/profile-pic-upload',authMiddleware,upload.single("profilePic"),userProfile);
router.get('/profile',authMiddleware,getUserPic);


module.exports = router;