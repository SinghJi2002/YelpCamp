const express=require("express")
const app=express()
const ejsMate=require('ejs-mate')
const path=require("path")
const mongoose=require("mongoose")
const methodOverride=require('method-override')
const session=require('express-session')
const multer=require('multer')
const bcrypt=require('bcrypt')
require('dotenv').config()
const {cloudinary,storage}=require('./cloudinary/index.js')
const upload=multer({storage})
const campgroundSchema=require("./models/campgroundSchema")
const userSchema=require('./models/userSchema')
const reviewsSchema=require('./models/reviewsSchema')

mongoose.connect("mongodb://localhost:27017/yelpCamp").then(()=>{
    console.log("Connected")
}).catch((err)=>{
    console.log(err)
})



app.set('view engine','ejs')
app.set('views',path.join(__dirname,'views'))
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'))
app.engine('ejs',ejsMate)
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({secret:"thisismysecret",resave:false,saveUninitialized:true}))
const protectRoute=(req,res,next)=>{
    if(req.session.user_id){
        next()
    }
    else{
        res.redirect('/login')
    }
}


app.post('/signup',upload.single('profile'),async(req,res)=>{
    const {name,username,email,address,password}=req.body
    const salt=await bcrypt.genSalt(10)
    const hash=await bcrypt.hash(password,salt)
    const image_path=req.file.path
    const image_name=req.file.filename
    const userData=new userSchema({
        name:name,
        username:username,
        email:email,
        address:address,
        password:hash,
        image_path:image_path,
        image_name:image_name
    })

    await userData.save()
    res.redirect('/login')
})
app.post('/login',async(req,res)=>{
    const {username,password}=req.body
    const userFound=await userSchema.findOne({username:username})
    if(userFound){
        const passwordMatch=await bcrypt.compare(password,userFound.password)
        if(passwordMatch){
            req.session.user_id=userFound._id
            res.redirect(`/campground/${username}`)
        }
        else{
            res.render('login.ejs',{error:true})
        }
    }
    else{
        res.render('login.ejs',{error:true})
    } 
})
app.post("/campground/create",async(req,res)=>{
    const {title,price,description,location,growth,total,longitude,latitude}=req.body
    const camp=new campgroundSchema({
        title:title,
        price:price,
        description:description,
        location:location,
        Percentage_Growth_In_Visits:growth,
        Number_Of_Visits_Till_Data:total,
        Longitude:longitude,
        Latitude:latitude
    })
    await camp.save()
    res.redirect('/campground')
})
app.post("/campground/:username/:id/review",async(req,res)=>{
    const {username,id}=req.params
    const {rating,review}=req.body

    const reviewData=new reviewsSchema({
        username:username,
        locationid:id,
        review:review,
        rating:rating
    })

    await reviewData.save()
    res.redirect(`/campground/${username}/${id}`)
})
app.put("/campground/:username/:id/edit",async(req,res)=>{
    const {title,price,description,location,growth,total,longitude,latitude}=req.body
    const {username,id}=req.params
    await campgroundSchema.updateOne({_id:id},{$set:{
        title:title,
        price:price,
        description:description,
        location:location,
        Percentage_Growth_In_Visits:growth,
        Number_Of_Visits_Till_Data:total,
        Longitude:longitude,
        Latitude:latitude
    }})
    res.redirect(`/campground/${username}/${id}`)
})
app.delete("/camground/:id/delete",async(req,res)=>{
    const {id}=req.params
    await campgroundSchema.deleteOne({_id:id})
    res.redirect("/campground")
})





app.get('/',(req,res)=>{
    res.sendFile(path.join(__dirname, 'views', 'home.html'));
})
app.get("/campground/:username",protectRoute,async(req,res)=>{
    const {username}=req.params
    let campData=await campgroundSchema.find({})
    res.render('campGround.ejs',{campData:campData,username:username})
})
app.get("/campground/:username/create",protectRoute,(req,res)=>{
    const {username}=req.params
    res.render("addNewForm.ejs",{username:username})
})
app.get("/campground/:username/:id/edit",protectRoute,async(req,res)=>{
    const {username,id}=req.params
    const single_data=await campgroundSchema.findOne({_id:id})
    res.render('editForm.ejs',{single_data:single_data,username:username,id:id})
})
app.get("/campground/:username/:id/delete",protectRoute,async(req,res)=>{
    const {username,id}=req.params
    res.render("delete.ejs",{id:id,username:username})
})
app.get("/campground/:username/:id",protectRoute,async(req,res)=>{
    const {username,id}=req.params
    const reviewData=await reviewsSchema.find({locationid:id})
    const reviewExists=await reviewsSchema.findOne({locationid:id})
    const campData_single=await campgroundSchema.findOne({_id:id})
    res.render('showDetails.ejs',{campData_single:campData_single,username:username,id:id,reviewData:reviewData, reviewExists:reviewExists})    
})
app.get("/campground/:username/:id/review",protectRoute,async(req,res)=>{
    const {username,id}=req.params
    res.render('review.ejs',{username:username,id:id})
})
app.get("/login",(req,res)=>{
    res.render('login.ejs',{error:null})
})
app.get("/signup",(req,res)=>{
    res.render('signup.ejs')
})



app.listen(3000,()=>{
    console.log("Running at port 3000")
})