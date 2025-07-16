const express=require('express');
const bcrypt=require('bcryptjs');
const jwt=require('jsonwebtoken');
const User=require('../models/User.js')

const router=express.Router();

//Register
router.post('/register',async(req,res)=>{
    const {name,email,password}=req.body;
    try{
        const exists= await User.findOne({email});
        if(exists) return res.status(400).json({message:"User already exists"});

        const user = await User.create({ name, email, password });
        const token= jwt.sign({id:user._id},process.env.JWT_SECRET,{
            expiresIn:'1hr'
        });
        res.status(201).json({token});
    }
    catch(err){
        res.status(500).json({message:err.message});
    }
});

// Login
router.post('/login',async(req,res)=>{
    const {email,password}=req.body;
    try{
        const user = await User.findOne({email});
        if(!user) {
            console.log('User not found:', email);
            return res.status(404).json({message:'User Not Found'});
        }

        const isMatch =await bcrypt.compare(password,user.password);
        if(!isMatch) {
            console.log('Password mismatch for:', email);
            return res.status(400).json({message:"Invalid Credentials"})
        }
        
        const token= jwt.sign({id:user._id},process.env.JWT_SECRET,{
            expiresIn:'1hr'
        });

        res.status(200).json({token});
    }catch(err){
        res.status(500).json({message:err.message});
    }
});

module.exports=router;