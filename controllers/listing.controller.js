const express=require('express')
const router=express.Router()
const Listing=require('../models/listing')
const listing = require('../models/listing')

//view new listing form
router.get('/new',(req,res)=>{
    res.render('listings/new.ejs')
})

//post new data to database
router.post('/', async (req,res)=>{
    await listing.create(req.body)
    res.send('you submitted the form')
})
module.exports=router