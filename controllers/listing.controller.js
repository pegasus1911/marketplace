const express=require('express')
const router=express.Router()
const Listing=require('../models/listing')
const listing = require('../models/listing')
const isSignedIn=require('../middleware/is-signed-in')

//view new listing form
router.get('/new',isSignedIn,(req,res)=>{
    res.render('listings/new.ejs')
})

//post new data to database
router.post('/', async (req,res)=>{
    try{
        req.body.seller=req.session.user._id
        await listing.create(req.body)
        res.redirect('/listings')
    res.send('you submitted the form')
    }
    catch(error){
        console.log(error)
        res.send("somethoing went werong")
    }
    
})

//VIEW THE INDEX PAGE
router.get('/',async (req,res)=>{
    const foundListings=await Listing.find()
    console.log(foundListings)
    res.render('listings/index.ejs', {foundListings: foundListings})
})

//view a single listings 
router.get('/:listingID',async (req,res)=>{
    const foundListings=await Listing.findById(req.params.listingID).populate('seller')
    return res.render('listings/show.ejs',{foundListings:foundListings})
})
//delete listings from database
router.delete('/:listingId', async (req,res)=>{
    //find the listing
    const foundListings=await Listing.findById(req.params.listingId).populate('seller')
    //check if the logged in user owns the lisings
    if(foundListings.seller._id.equals(req.session.user._id)){
        //delete teh listings directly
        await foundListings.deleteOne()
        res.redirect('/')
    }
    return res.send('not authorized to delete')
})

//reder
router.get('/:listingId/edit', async (req,res)=>{
    const foundListings=await Listing.findById(req.params.listingId).populate('seller')
    if(foundListings.seller._id.equals(req.session.user._id)){
        return res.render('listings/edit.ejs',{foundListings: foundListings})
    }
    return res.send('not authorised')
})
router.put('/:listingId', async (req,res)=>{
    const foundListings=await Listing.findById(req.params.listingId).populate('seller')
    if(foundListings.seller._id.equals(req.session.user._id)){
        await Listing.findByIdAndUpdate(req/params.listingId,req.body, {new:true})
        return res.redirect(`listings/${req.params.listingId}`)
    }
    return res.send('you updated the lisitng'+req.params.listingId)
})
module.exports=router