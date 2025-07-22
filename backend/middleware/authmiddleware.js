const jwt=require('jsonwebtoken');
const User = require('../models/User'); 


const protect= async (req,res,next)=>{
    // extracting the token from the header of the client request
    const token=req.headers.authorization?.split(' ')[1];

    if(!token) return res.status(401).json({message:'Unauthorized'});

    //verifying the token
    try{
        const decoded =jwt.verify(token,process.env.JWT_SECRET);
        req.user = await User.findById(decoded.id).select('-password');
         if (!req.user) {
             return res.status(401).json({ message: 'User not found' });
        }
        // calling the next middleware
        next();
    }catch(error){
        console.error('Token verification failed:', error);
        return res.status(401).json({ message: 'Token is not valid' })
    }
};

module.exports=protect;