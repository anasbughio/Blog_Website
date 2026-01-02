const express =  require('express');
const router = express.Router();
const {postComment,getComment,updateComment,deleteComment} = require("../controllers/commentController");
const authMiddleware = require('../middlewares/authMiddlewares');



router.post('/:postId',authMiddleware,postComment);
router.get('/:postId',getComment);
router.put('/:id',authMiddleware,updateComment);
router.delete('/:id',authMiddleware,deleteComment);


module.exports = router;