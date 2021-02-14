const mongoose = require('mongoose');
const Profile = require('./Profile');
const Schema = mongoose.Schema;

const PostSchema = new Schema({
    user:{
        type:Schema.Types.ObjectId,
        ref:'users'
    },
    text:{
        type:String,
        required:true
    },
    name:{
        type:String
    },
    avatar:{
        type:String
    },
    likes:[
        {
            user:{
                type:Schema.Types.ObjectId,
                ref:'users'
            }
        }
    ],
    comments:[
        {
            users:{
                type:Schema.Types.ObjectId,
                ref:'users'
            },
            text:{
                type:String,
               
            },
            date:{
                type:Date,
                default:Date.now
            } 
        }
    ],
    date:{
        type:Date,
        default:Date.now
    } 

})

module.exports= Post =mongoose.model('post',PostSchema)