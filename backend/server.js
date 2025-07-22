const express=require('express');
const mongoose=require('mongoose');
const cors=require('cors');
const path=require('path');
const protect=require('./middleware/authmiddleware.js');
require('dotenv').config();

const app=express();
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));


mongoose.connect(process.env.MONGO_URI,{
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(()=> console.log('MongoDB connected'))
.catch(err=>console.log(err));


app.get('/',protect,(req,res)=>res.send('API running'));

// TODO:ADD Routes
app.use('/api/auth', require('./routes/auth.js'));
app.use('/api/designs', require('./routes/designs.js'));
app.use('/api/community',require('./routes/posts.js'));

const PORT =process.env.PORT || 5000;

app.listen(PORT,()=>console.log(`Server started at port: ${PORT}`));
