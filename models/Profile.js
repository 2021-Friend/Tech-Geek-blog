const mongoose = require('mongoose')

const ProfileSchema = new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'user'
    },

    phone:{
        type:Number,
        required:true,
        unique:true 

    },
   
    SocialMedia:{

        youtube:{
            type:String
    },
        twitter:{
            type:String

    },
        facebook:{
            type:String

    },
        linkedin:{
            type:String

    },

  

    


    },
    skills:{
        type:[String],
        required:true
    },
    date:{
        type:Date,
        default:Date.now
    }




})
module.exports=Profile=mongoose.model('profile',ProfileSchema)