    const express  =  require('express');
    const { createPost, getPosts, deletePost,postDetails, updatePost, searchPost } = require('../controllers/postController');
    const route = express.Router();


    route.post('/',createPost);
    route.get('/search',searchPost);
    route.get('/:id',postDetails);
    route.get('/',getPosts);
    route.delete('/:id',deletePost);
    route.put('/:id',updatePost);
    module.exports = route;