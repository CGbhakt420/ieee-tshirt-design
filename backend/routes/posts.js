const express=require('express');
const router=express.Router();
const Post=require('../models/Post.js');
const Comment = require('../models/Comment');
const protect = require('../middleware/authmiddleware');

// creating posts
// POST api/community/posts

router.post("/posts",protect,async(req,res)=>{
    const {title,description,designUrl}=req.body;
    try{
        const newPost=await Post.create({
            title,
            description,
            designUrl,
            user:req.user._id
        });
        res.status(201).json(newPost);
    }catch(err){
        console.error("Failed to create post:", err);
        res.status(500).json({
            message:"Failed to create post."
        });
    }
});

//get all the posts
// GET api/community/posts

router.get("/posts",protect,async(req,res)=>{
    try{

        //getting the post sorted on the basis of number of likes
        const posts= await Post.aggregate([
            {
            // extra (likeCount field is added)
               $addFields:{
                likeCount:{$size:"$likes"},// count the likes from array
               },
            },
            {
                $sort:{
                    likeCount:-1,
                    createdAt:-1,
                },
            },
        ])
        
        // getting the "name" field also in the response with the help of populate
        // from user model 
        const populatedPosts=await Post.populate(posts,{
            path:"user",
            select:"name",
        });
        
        res.json(populatedPosts);
    }catch(err){
        console.error("Failed to fetch posts:", err);
        res.status(500).json({
            message:"Failed to Fetch posts."
        });

    }
});

// like/unlike post
// POST api/community/posts/:postId/like

router.post("/posts/:postId/like",protect,async(req,res)=>{
// extracting the postId
const { postId }=req.params;

try{
    const post=await Post.findById(postId);
    if (!post) {
            return res.status(404).json({ message: "Post not found" });
    }
    const userId=req.user._id;
    // getting the index of the userId who have clicked
    const index=post.likes.indexOf(userId)

    if(index>-1){
        // Dislike
        // removing from the liked user list
        post.likes.splice(index,1);
    }
    else{
        //Like
        // adding the userId to the likes list
        post.likes.push(userId);
    }

    // pushing into db
    await post.save();
    res.json({likes:post.likes.length});
}catch(err){
    console.error("Failed to update like:", err); 
    res.status(500).json({
        message:"Failed to update the like"
    });
}
});

// Adding a comment to the post
// POST api/community/posts/:postId/comments

router.post('/posts/:postId/comments',protect,async(req,res)=>{
    const {postId} =req.params;
    const {text,parentComment}=req.body;
    try{
        const userId= req.user._id;

        // check if post exists
        const post=await Post.findById(postId);
        if(!post){
            return res.status(404).json({message:"Post not Found"});
        }

        // if it,s a reply ,validate parent comment
        if(parentComment){
            const parent=await Comment.findById(parentComment);
            if(!parent){
                return res.status(400).json({message:"Parent Comment not found"});
            }
        }
        // create comment or reply
        const newComment=await Comment.create({
           post:postId,
           user:userId, 
           text:text,
           parentComment:parentComment || null,
        });

        await newComment.save();

        res.status(201).json(newComment);
    }catch(err){
        console.error("Error Creating the comment:",error);
        res.status(500).json({message:"Internal Server Error"})
    }
});

//get comments for a Post
// GET api/community/posts/:postId/comments

router.get('/posts/:postId/comments',protect,async (req,res)=>{
    const {postId}=req.params;
    try{
        const post=await Post.findById(postId);
        const user=req.user._id;
        if(!post){
            return res.status(404).json({message:"Post not Found"});
        }

        const comments=await Comment.find({post:postId})
            .populate('user','name')
            .sort({createdAt:1});

        // Grouping the comments based on their parentComment
        const grouped={};
        comments.forEach((comment)=>{
            const parentId=comment.parentComment?.toString()||'root';
            if(!grouped[parentId]) grouped[parentId]=[];
            grouped[parentId].push(comment);
        });

        // getting top level comments
        const topLevel =grouped['root']||[];

        // Attach replies to the top level comments
        // function for fetching the nested replies of the toplevel comments
        const nestReplies=(commentList)=>{
            return commentList.map((comment)=>{
                const replies =grouped[comment._id.toString()] || [];
                // sending the replies of the parent comments as "replies" key to the frontend
                return{
                    ...comment.toObject(),
                    replies:replies.map((r)=>r.toObject()),
                };
            });
        };

        const structured=nestReplies(topLevel);

        res.json(structured);
    }catch(err){
        console.error('Error fetching nested comments:', err);
        res.status(500).json({ message: 'Internal server error' }); 
    }
});

// delete the post 
//DELETE /api/community/posts/:postId
router.delete('/posts/:postId',protect,async (req,res)=>{
    const {postId}=req.params;
    try{
        const post=await Post.findById(postId);
        const currentUser=req.user._id;

        // only the creator of the post can delete the post
        if(!post.user.equals(currentUser)){
            return res.status(403).json({message:"Unauthorized"});
        }

        await Comment.deleteMany({post:post._id});
        await post.remove();
        res.json({message:"Post and associated comments deleted."});
    }catch(err){
        console.error("Error deleting post:", err);
        res.status(500).json({message:"Internal Server Error"})
    }
})

// delete the comment
// DELETE /api/community/posts/:postId/comments/:commentId

router.delete('posts/:postId/comments/:commentId',protect,async(req,res)=>{
try{
    const commentIdToDelete = req.params.commentId;
    const userId = req.user._id;

    // finding comment to delete
    const mainComment = await Comment.findById(commentIdToDelete);

    if(!mainComment){
        return res.status(404).json({message:"Comment not found."});
    }

    // check if user is authorized to delete the comment
    if(!mainComment.user.equals(userId)){
        return res.status(403).json({message:'Unauthorized action'});
    }

    // accumulating all its replies
    const commentsToDelete=[];
    const queue= [commentIdToDelete];

    // doing bfs to get all the comments id
    while(queue.length>0){
        // get the front elem of queue
        const currentCommentId=queue.shift();
        commentsToDelete.push(currentCommentId);

        const replies=await Comment.find({
            parentComment:currentCommentId
        }).select('_id');

        // adding the ids of the replies to the queue
        for (const reply of replies){
            queue.push(reply._id);
        }
    }
       // Delete the main comment and all its collected replies from the database
    await Comment.deleteMany({ _id: { $in: commentsToDelete } });

    res.json({ message: "Comment and all replies deleted successfully." });

} catch(err){
    console.error("Error deleting comment:", err);
    res.status(500).json({ message: "Internal Server Error" });
}
});

module.exports=router;