const Posts = require('../models/post');
// const { post } = require('../routes/postsRoute');



const createPost = async (req,res)=>{
    const {title,content,img} =  req.body;
    try {
        const post = new Posts({
            title,
            content,
            img,
            auther: req.user.userId,
            createdAt:Date.now()

        });
      await  post.save();
        console.log("Post Added Successfully");
           const populatedPost = await Posts.findById(post._id).populate("auther","username email _id");
    res.status(201).json(populatedPost);
    } catch (error) {
         console.error("Error adding post:", error.message);
    res.status(500).json({ message: "Failed to create post" });
    }
}


const getPosts = async (req,res)=>{
  try {
  const allPosts  =   await Posts.find().populate("auther","username email _id profilePic");
  res.status(200).json(allPosts);
  // console.log(allPosts);
  } catch (error) {
    res.status(500).json("posts does not fetched");
  }
}
const postDetails = async (req,res)=>{
  const id = req.params.id
  try {
  const allPosts  =   await Posts.findById(id).populate("auther","username email _id profilePic");
  res.status(200).json(allPosts);
  } catch (error) {
    res.status(500).json("posts does not fetched");
  }
}


const deletePost =  async(req,res)=>{
try {
    const post = await Posts.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    if (post.auther.toString() !== req.user.userId) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await Posts.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Deleted" });
  } catch (error) {
    res.status(500).json({ message: "Server Error in deletePost" });
  }
}


const updatePost = async (req,res)=>{
   try {
    const post = await Posts.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    if (post.auther.toString() !== req.user.userId) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const updated = await Posts.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ message: "Server Error in updatePost" });
  }
}


const searchPost = async (req,res)=>{
  try {
    const { title } = req.query;
    if (!title) return res.status(400).json({ msg: "Title query is required" });

    const regex = new RegExp(title, "i"); // safer way
    const posts = await Posts.find({ title: regex })
      .populate("auther", "username profilePic");
      res.json(posts);
  } catch (err) {
    console.error("Search error:", err);
    res.status(500).json({ msg: "Server error" });
  }
};
module.exports = {createPost,getPosts ,deletePost,postDetails,updatePost,searchPost}