const jwt=require('jsonwebtoken');


const protect= (req,res,next)=>{
    // extracting the token from the header of the client request
    const token=req.headers.authorization?.split(' ')[1];

    if(!token) return res.status(401).json({message:'Unauthorized'});

    //verifying the token
    try{
        const decoded =jwt.verify(token,process.env.JWT_SECRET);
        req.user = decoded;
        // calling the next middleware
        next();
    }catch{
        return res.status(401).json({message:'Token Failed'});
    }
};

module.exports=protect;