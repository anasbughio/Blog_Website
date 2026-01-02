const mongoose = require('mongoose');


const postSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    content:{
        type:String,
        required:true
    },
    img:{
        type:String,
    },
    auther:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },

    
    createdAt:{
        type:Date,
        default:Date.now
    }



},{timestamps:true});

const Posts  = mongoose.model('Posts',postSchema);
module.exports = Posts;
