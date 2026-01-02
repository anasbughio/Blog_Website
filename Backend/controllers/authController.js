const User = require('../models/user');
const Posts = require('../models/post');
const bcrypt = require('bcryptjs');
const jwt  = require('jsonwebtoken');



const register = async (req,res)=>{

    const {username,email,password} = req.body;
    try{
        const existingUser = await User.findOne({email});
        if(existingUser) return res.status(409).json({message:"User already exists"});
         const saltRounds = parseInt(process.env.SALT_ROUNDS) || 10;
        const hashedPassword = await bcrypt.hash(password,saltRounds);
        const newUser = await User.create({username,email,password:hashedPassword});
        const token = jwt.sign({id:newUser._id},process.env.JWT_SECRET,{expiresIn:"1h"});
        res.cookie("token",token,{
            httpOnly:true,
            secure:false,
            sameSite:"strict",
            maxAge:3600000 // 1 hour
        });

            const userToReturn = newUser.toObject();
    delete userToReturn.password;
   
  res.status(201).json({
  message: "User registered successfully",
  user: { _id: newUser._id, username: newUser.username, email: newUser.email }
});
    
    }catch(error){
         console.error(error);
    if (error.code === 11000) {
      return res.status(409).json({ message: "Email already in use" });
    }
    res.status(500).json({ message: "Internal Server Error" });
    };
}


const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (!existingUser)
      return res.status(404).json({ message: "User not found" });

    const isPasswordValid = await bcrypt.compare(password,existingUser.password);
    if (!isPasswordValid)
      return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: existingUser._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

   res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      path: "/",     
        maxAge: 60 * 60 * 1000 // 1 hour in milliseconds
    });

    const userData = existingUser.toObject();
    delete userData.password;
console.log(userData);
res.status(200).json({
  message: "Login successful",
  user: { _id: existingUser._id, username: existingUser.username, email: existingUser.email }
});
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};



const logoutUser = (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: false, // true if using https
    sameSite: "lax",
     path: "/"

  });
  return res.status(200).json({ message: "Logged out successfully" });
};
const me = async (req, res) => {
  try {
    // req.user is added in authMiddleware after verifying JWT
    const foundUser = await User.findById(req.user.userId).select("-password");
    if (!foundUser) return res.status(404).json({ message: "User not found" });

    res.json(foundUser);

    console.log("Decoded user in /auth/me:", req.user);
    console.log("Fetched user:", foundUser);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};


// controllers/authController.js (userProfile function)
const userProfile = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });

    // Use BACKEND_URL or default to localhost
    const backendUrl = process.env.BACKEND_URL || `http://localhost:${process.env.PORT || 5000}`;

    // Save full URL in DB
    const filePath = `${backendUrl}/uploads/${req.file.filename}`;

    const updatedUser = await User.findByIdAndUpdate(
      req.user.userId,
      { profilePic: filePath },
      { new: true, select: "-password" }
    );

    res.status(200).json(updatedUser);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error uploading profile picture" });
  }
};

const getUserPic = async (req,res)=>{
  try {
    const user = await User.findById(req.user.userId).select('-password');
    const posts = await Posts.find({ auther: req.user.userId }).sort({ createdAt: -1 });
    res.status(200).json({ user, posts });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error fetching profile" });
  }
};

module.exports = { register, loginUser, logoutUser,me,userProfile ,getUserPic};