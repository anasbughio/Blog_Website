const Bookmark = require("../models/bookmark");

const addBookMark = async (req,res)=>{

      try {
    const existing = await Bookmark.findOne({ user: req.user.userId, post: req.params.postId });
    if (existing) return res.status(400).json({ message: 'Already bookmarked' });

    const bookmark = new Bookmark({ user: req.user.userId, post: req.params.postId });
    await bookmark.save();
    res.status(201).json(bookmark);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};


const deleteBookMark = async (req,res)=>{
    try {
    await Bookmark.findOneAndDelete({ user: req.user.userId, post: req.params.postId });
    res.status(200).json({ message: 'Bookmark removed' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};


const getBookMarks = async (req,res)=>{
     try {
    const bookmarks = await Bookmark.find({ user: req.user.userId }).populate('post');
    res.status(200).json(bookmarks);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {addBookMark,deleteBookMark,getBookMarks};




