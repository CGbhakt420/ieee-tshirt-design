import mongoose from 'mongoose';

// have to be updated in future 
// scheme 1 when we click at the listing
// the image shown should be the design image
// when clicked have to be rendered on the tshirt
// for rendering have to store the image on the tshirt separately


const designSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  designImageUrl: String,
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model('Design', designSchema);