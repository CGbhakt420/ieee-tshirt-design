const express=require('express');
const Design=require('../models/Design.js');
const protect=require('../middleware/authmiddleware.js');

const router=express.Router();

// creating a design
router.post('/',protect,async (req,res)=>{
    const {
        color,
        designUrl,
        logoDecal,
        fullDecal,
        isLogoTexture,
        isFullTexture,
        logoPosition,
        logoRotation,
        logoScale,
    }=req.body;
    try{
        const newDesign = await Design.create({
            user:req.user.id,
            designUrl,
            color,
            logoDecal,
            fullDecal,
            isLogoTexture,
            isFullTexture,
            logoPosition,
            logoRotation,
            logoScale,
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

// fetching a particular design trigerred basically on clicking on the image

router.get('/:designId',protect,async(req,res)=>{
    try{
        // getting the id(pk) of the saved design 
        const designId=req.params.designId;

        const design=await Design.findOne({
            _id:designId,
            user:req.user.id,
        });

        if(!design){
            return res.status(404).json({message:'Design not Found'})
        }

        res.status(200).json(design);
    }catch(error){
        res.status(500).json({message:error.message});
    }
})

router.delete('/:designId', protect, async (req, res) => {
  try {
    const design = await Design.findOneAndDelete({
      _id: req.params.designId,
      user: req.user.id,
    });
    if (!design) {
      return res.status(404).json({ message: 'Design not found' });
    }
    res.json({ message: 'Design deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


module.exports=router;