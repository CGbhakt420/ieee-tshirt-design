const express=require('express')
const Design=require('../models/Design.js');
const protect=require('../middleware/authmiddleware.js');

const router=express.Router();

// creating a design
router.post('/',protect,async (req,res)=>{
    try{
        const newDesign = await Design.create({
            user:req.user.id,
            designUrl:req.body.designUrl
        });
        res.status(201).json(newDesign);
    }
    catch(err){
        res.status(500).json({message:err.message});
    }
});

// fetching the listing of designs
router.get('/',protect,async (req,res)=>{
    try{
        const designs=await Design.find({user:req.user.id});
        res.status(200).json(designs);
    }catch(err){
        res.status(500).json({message:err.message});
    }
});

export default router;