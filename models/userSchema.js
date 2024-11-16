const mongoose=require("mongoose")
const Schema=mongoose.Schema;

const userSchema=new Schema({
    name:{
        type:String,
        required:true
    },
    username:{
        type:String,
        required:true,
        unique:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    address:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true,
        unique:true
    },
    image_path:{
        type:String,
        required:true
    },
    image_name:{
        type:String,
        required:true
    },
    CreatedAt:{
        type: Date,
        default: Date.now
    }
})

module.exports=mongoose.model("userSchema",userSchema)
