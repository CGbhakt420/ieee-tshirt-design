const mongoose=require('mongoose')
const bcrypt =require('bcryptjs')

const UserSchema = new mongoose.Schema({
    username:{type:String,required:true},
    email:{type:String,required:true,unique:true},
    password:{type:String,required:true},
},
{timestamps:true}
);

UserSchema.pre('save',async function(){
    const user=this;
    if(!user.isModified('password')) return;
    // generating the salt
    const salt=await bcrypt.genSalt(10);
    // storing the hashed password
    user.password=await bcrypt.hash(user.password,salt);
});

export default mongoose.model('User',UserSchema)
