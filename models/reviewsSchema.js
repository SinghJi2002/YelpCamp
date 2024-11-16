const mongoose=require("mongoose")
const Schema=mongoose.Schema;

const reviewsSchema=new Schema({
    username:{
        type:String,
        required:true,
        unique:true
    },
    locationid:{
        type:String,
        required:true,
        unique:true
    },
    review:{
        type:String,
        required:true
    },
    rating:{
        type:Number,
        required:true,
    },
    CreatedAt:{
        type: Date,
        default: Date.now
    }
})

module.exports=mongoose.model("reviewsSchema",reviewsSchema)
