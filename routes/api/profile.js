const express= require('express')
const router = express.Router()
const auth = require('../../middleware/auth')
const User = require('../../models/User')
//@route GET api/users
//@access PUblic
const Profile = require('../../models/Profile')
const { body,validationResult } = require('express-validator')
router.get('/',auth,async(req,res)=>{
    try{
      
        const profile = await (await Profile.findOne({user:req.user.id})).populate('user',['name'])
        if(profile==null){
            res.json({msg:"profile is not found"})
        }
        if(!profile){
             res.status(400).json({msg:'There is no profile for this user'})
        }
             res.json(profile)
    }
    catch(err){
        
       res.status(500).json({msg:"error"})

    }
})

//@router POST api/profile
//@desc   Create or update user profile
//@access  private
router.post('/',[auth,[
    body("phone","number  is required")
    .not()
    .isEmpty(),
    body("skills","Skills is required").not().isEmpty()
]
]
    ,
    async(req,res)=>{
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.status(400).json({error:errors.array()})

        }
        const {
            phone,
            SocialMedia,
            skills
        }=req.body
        //Build social objects
        const profileFields ={}
        profileFields.user=req.user.id
        if(phone) profileFields.phone=phone
        // if(SocialMedia) profileFields.SocialMedia=SocialMedia
        if(skills) profileFields.skills=skills
        try{
            let profile = await(await Profile.findOne({user:req.user.id}))

            if(profile){
                //update
                console.log("fdsfdsfdsaf")
                profile= await Profile.findByIdAndUpdate({user:req.user.id},
                {$set:profileFields},
                {new:true}
                );
                
            }
            // Create
            profile = new Profile(profileFields)

            await profile.save()
            return res.json(profile) 
        }
        catch(err){
            console.log(err.message)
            return res.status(500).json({msg:"server error"})

        }

    }
);

router.get('/',async(req,res)=>{
    try {
        const profile = await (await Profile.findOne({user:req.parms.user_id})).populate('user',
        ['name','avatar'])
        if(!profile){
            return res.status(400).json({msg:"There is mo profile for this user"})
        }
        res.json(profile)
    }
    catch(err){
        console.error(err.message)
        if(err.kind=='ObjectId'){
            return res.status(400).json({msg:'Profile not found '});
        }
        res.status(500).json({msg:"server error"})

    }
})
router.delete('/',auth,async(req,res)=>{
    try {
       
        await Profile.findOneAndRemove({user:req.user.id});
        await User.findOneAndRemove({_id:req.user.id})

      return   res.json({mag:'user deleted'})

    }
    catch(err){
        console.error(err.message)
      
        res.status(500).json({msg:"server error"})

    }
})


module.exports =router