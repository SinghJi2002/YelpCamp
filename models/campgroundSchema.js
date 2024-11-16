const mongoose=require("mongoose")
const Schema=mongoose.Schema;
const campgroudSchema=new Schema({
    picture:String,
    title:String,
    price:String,
    description:String,
    location:String,
    Percentage_Growth_In_Visits:String,
    Number_Of_Visits_Till_Data:String,
    Longitude:String,
    Latitude:String
})

module.exports=mongoose.model("camgroundSchema",campgroudSchema)