const express = require('express');
const { connect } = require('mongoose');
const connectDB= require('./config/db')
const app = express();

//connect DB
 
connectDB();
app.use(express.json( {extended:false}  ))
app.get('/',(req,res)=>res.send("Api sending"

))
// Define Routes
app.use('/api/register',require('./routes/api/users'))
app.use('/api/login',require('./routes/api/auth'))
app.use('/api/profile',require('./routes/api/profile'))
app.use('/api/posts',require('./routes/api/posts'))
const PORT=process.env.PORT || 8000;

app.listen(PORT,()=>console.log(`listing on port ${PORT}`))