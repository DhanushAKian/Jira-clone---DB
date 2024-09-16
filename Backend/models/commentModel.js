import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
  user:{
    type:mongoose.Schema.ObjectId,
    ref:"User",
    //required:true,
  },
  comment:{
    type: String,
   required: true,
  }
})
const Comment= mongoose.model("Comment",commentSchema)

export default Comment;