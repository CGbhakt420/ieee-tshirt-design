const mongoose =require('mongoose');

// comment schema which can handle replies too 
const commentSchema=mongoose.Schema({
    post:{type:mongoose.Schema.Types.ObjectId,ref:'Post',
        required:true
    },
    user:{type:mongoose.Schema.Types.ObjectId,ref:'User',
        required:true
    },
    text:{type:String,required:true},
    // self reference
    parentComment:{
        type:mongoose.Schema.Types.ObjectId,ref:'Comment',
        default:null,
    },
    createdAt:{type:Date,default:Date.now}
});

module.exports=mongoose.model('Comment',commentSchema);