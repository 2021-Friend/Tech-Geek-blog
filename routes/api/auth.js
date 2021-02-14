const express= require('express')
const router = express.Router()
const auth = require('../../middleware/auth')
const  User = require('../../models/User')
const {body,validationResult}= require("express-validator")
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const config = require('config')
//@route GET api/auth
//@access PUblic
router.get('/',auth,async(req,res)=>{
    try{
        const user = await User.findById(req.user.id).select('-password')
        res.json(user)
    }
    catch(err){
        // console.error(err.message);
        res.status(500).send('Server error')

    }
})
router.post('/',
 // username must be an email
[ 
 body('email',"please enter the valid email address").isEmail(),
 // password must be at least 5 chars long
 body('password','password is required').exists()],
 async (req,res)=>{
    const error=validationResult(req);
    if(!error.isEmpty()){
        return res.status(400).json({error:error.array()});
    }


const {email , password} = req.body;
try{
  var user = await User.findOne({email})
  if(!user){
    return   res.status(400).json({error:[{mag:"Invalid cerdentials"}]})

  }
  
  
    const isMatch= await bcrypt.compareSync(password,user.password)
    if(!isMatch){
        return res
        .status(400)
        .json({error:[{msg:'Invaild Credentials'}]})
    }
    const payload= {
        user:{
            id:user.id,
            

        }

    }
     jwt.sign(
         payload,
         config.get('jwtSecret'),
         {expiresIn:360000},
         (err,token)=>{
             if(err) throw err;
             res.json({token:token})
         }

     )
    //Return Jsonwebtoken

} catch(err){

return  res.status(400).send("server error")
}
 })

module.exports =router