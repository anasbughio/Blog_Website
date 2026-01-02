const Comment = require('../models/comment');

const postComment = async (req,res)=>{
    try {
        console.log("Params:", req.params);
        console.log("Body:", req.body);
        console.log("User:", req.user);

        const comment  = new Comment({
            content:req.body.content,
            post:req.params.postId,
                auther: req.user.userId   // <-- FIXED
        });

        await comment.save();
        console.log("req.user inside postComment:", req.user);

        res.status(201).json(comment);

    } catch (error) {
        console.error("Error in postComment:", error);
        res.status(500).json({error:"Error in adding comment", details: error.message});
    }
}


const getComment = async (req, res) => {
  try {
    const { postId } = req.params;

    const comments = await Comment.find({ post: postId })
      .populate("auther", "username _id")
      .sort({ createdAt: -1 });

    res.status(200).json(comments);
  } catch (error) {
    console.error("Error fetching comments:", error.message);
    res.status(500).json({ error: "Comments could not be fetched", details: error.message });
  }
};


const updateComment = async (req,res)=>{
    try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) return res.status(404).json({ error: "Not found" });

    if (comment.auther.toString() !== req.user._id) {
      return res.status(403).json({ error: "Not allowed" });
    }

    comment.content = req.body.content;
    await comment.save();
    res.json(comment);
  } catch (err) {
    res.status(500).json({ error: "Error updating comment" });
  }
}


const deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);

    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    // Debug logs
    console.log("Comment auther (from DB):", comment.auther?.toString());
    console.log("Logged in user (from token):", req.user.userId);

    // Ownership check
    if (comment.auther && comment.auther.toString() !== req.user.userId) {
      return res.status(403).json({ message: "Not allowed to delete this comment" });
    }

    await comment.deleteOne();

    res.status(200).json({ message: "Comment deleted successfully" });
  } catch (error) {
    console.error("Error deleting comment:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {postComment,getComment,updateComment,deleteComment};