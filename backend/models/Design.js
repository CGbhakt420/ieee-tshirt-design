const mongoose=require('mongoose')

// have to be updated in future 
// scheme 1 when we click at the listing
// the image shown should be the design image
// when clicked have to be rendered on the tshirt
// for rendering have to store the image on the tshirt separately


const designSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  designUrl: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Design', designSchema);