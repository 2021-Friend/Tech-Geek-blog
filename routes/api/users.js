const express= require('express')
const router = express.Router()
const jwt = require('jsonwebtoken')
const gravatar= require('gravatar')
const {body,validationResult}= require("express-validator")
const User = require('../../models/User')
const  bcrypt= require('bcryptjs')
const config = require('config')
//@route GET api/users
//@access PUblic
router.post('/',
 // username must be an email
[ body('name','Name is required').not().isEmpty(),
 body('email',"please enter the valid email address").isEmail(),
 // password must be at least 5 chars long
 body('password','plase enter at least 8 ').isLength({ min: 8 })],
 async (req,res)=>{
    const error=validationResult(req);
    if(!error.isEmpty()){
        return res.status(400).json({error:error.array()});
    }


const {name , email , password} = req.body;
try{
  var user = await User.findOne({email})
  if(user){
    return   res.status(400).json({error:[{mag:"user already exist"}]})

  }
  const avatar = gravatar.url(email,{
      s:'200',
      r:'pg',
      d:'mm'
  })
  user = new User({
      name,
      email,
      avatar,
      password
  });
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password,salt)

    await user.save()
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