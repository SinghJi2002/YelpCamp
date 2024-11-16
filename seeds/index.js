const mongoose=require("mongoose")
const campGround=require("../models/campgroundSchema")
mongoose.connect("mongodb://localhost:27017/yelpCamp").then(()=>{
    console.log('connected')
}).catch((err)=>{
    console.log(err)
})

const cities=require("./cities")
const {descriptors,places,pictures}=require("./seedHelpers")

const seedDB=async()=>{
    await campGround.deleteMany({})
    for(let i=0;i<cities.length;i++){
        const randomDescriptorIndex = Math.floor(Math.random() * descriptors.length);
        const randomPlaceIndex = Math.floor(Math.random() * places.length);
        const randomPictureLink= Math.floor(Math.random() * pictures.length);
        const camp=new campGround({
            picture:pictures[randomPictureLink],
            title:`${descriptors[randomDescriptorIndex]} ${places[randomPlaceIndex]}`,
            price:"1000000",
            description:"",
            location:`${cities[i].city},${cities[i].state}`,
            Percentage_Growth_In_Visits:`${cities[i].growth_from_2000_to_2013}`,
            Number_Of_Visits_Till_Data:`${cities[i].population}`,
            Longitude:`${cities[i].longitude}`,
            Latitude:`${cities[i].latitude}`
        })
        await camp.save()
    }
}

seedDB().then(()=>{
    mongoose.connection.close()
});
