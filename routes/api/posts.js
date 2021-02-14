const express= require('express')
const router = express.Router();
const {body,validationResult}=require('express-validator')
const auth = require('../../middleware/auth');
const User = require('../../models/User');
const Post = require('../../models/Post')
const Profile = require('../../models/Profile');

//@route GET api/posts
//@access PUblic
router.post('/',[auth,[
    body('text','text is required').not().isEmpty()
]
],
async(req,res)=>{
    const errors = validationResult(req)
    
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()})
    }

    try{    
    const user = await User.findById(req.user.id).select('-password')

    const newPost = new Post({
        text:req.body.text,
        name:user.name,
        
        user:req.user.id

    })
    const post = await newPost.save();

  return res.json({post:post})
    }
    catch(err){
        console.error(err.message)
      return  res.status(500).json({mag:"server error"})
    }
})


module.exports =router