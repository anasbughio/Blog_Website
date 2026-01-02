const express = require('express');
const router = express.Router();
const {addBookMark,deleteBookMark,getBookMarks} = require('../controllers/bookMarkController');
const authMiddleware = require('../middlewares/authMiddlewares');



router.post('/:postId', authMiddleware, addBookMark);
router.delete('/:postId', authMiddleware, deleteBookMark);
router.get('/', authMiddleware, getBookMarks);

module.exports = router;