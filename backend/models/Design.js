const mongoose=require('mongoose')

// have to be updated in future 
// scheme 1 when we click at the listing
// the image shown should be the design image
// when clicked have to be rendered on the tshirt
// for rendering have to store the image on the tshirt separately


// updated schema
const designSchema = new mongoose.Schema({
  user: {type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  color:{type:String,required:true},
  logoDecal:{type:String},
  fullDecal:{type:String},
  designUrl: {type:String },
  isLogoTexture:{type:Boolean,default:true},
  isFullTexture:{type:Boolean,default:false},
  createdAt: {type: Date, default: Date.now },
});

module.exports = mongoose.model('Design', designSchema);