const express=require("express");
const app=express();
const path=require("path");
const port=8080;
const mongoose=require("mongoose");
const Listing=require("./models/listing.js");
const methodOverride=require("method-override");
const ejsMate=require("ejs-mate");


app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.static(path.join(__dirname,"/public")));
app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(methodOverride('_method'));
app.engine("ejs",ejsMate);

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
main().then(() => {
    console.log("connected to DB");
  }).catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(MONGO_URL);
}

// app.get("/testListing",async (req,res)=>{
// let samplelisting=new Listing({
// title:"My New Villa",
// description:"By the beach",
// price:1200,
// location:"calangute , Goa",
// country:"India"
// });
// await samplelisting.save().then((res)=>{
// console.log(res);
// }).catch((err)=>{
// console.log(err);
// });
// });

app.get("/Listings",async(req,res)=>{
const allListings= await Listing.find({});
res.render("listings/index.ejs",{allListings});
});
//
app.get("/Listings/new",(req,res)=>{
res.render("listings/new.ejs");
});

//show route
app.get("/Listings/:id",async (req,res)=>{
let {id}=req.params;
const listing=await Listing.findById(id);
res.render("listings/show.ejs",{listing});
});

//create rout
app.post("/Listings",async(req,res)=>{
  // let{title,description,image,price,country,location}=req.body;//one way
// let listing=req.body.listing; //another way
const newlisting=new Listing(req.body.listing);
await newlisting.save();
res.redirect("/Listings")
});

//edit route
app.get("/Listings/:id/edit",async(req,res)=>{
let {id}=req.params;
const listing=await Listing.findById(id);
res.render("listings/edit.ejs",{listing});

});
//update route
app.put("/Listings/:id",async(req,res)=>{
let {id}=req.params;
await Listing.findByIdAndUpdate(id,{...req.body.listing});
res.redirect("/Listings");
});

//delete route
app.delete("/Listings/:id",async(req,res)=>{
let {id}=req.params;
let deletedlisting= await Listing.findByIdAndDelete(id);
res.redirect("/Listings");
});


app.get("/",(req,res)=>{
res.redirect("/Listings");
});

app.listen(port,()=>{
console.log("port is working");

});