const express = require('express');
const bodyParser=require('body-parser');

const mongoose= require('mongoose');
const authenticate = require('../models/authenticate')
const Promotions=require('../models/promotions');

const promoRouter = express.Router();
promoRouter.use(bodyParser.json());
// (/) end point
promoRouter.route('/')
  
  .get((req,res,next) => {
    Promotions.find({}).then((promos)=>{
        res.statusCode=200;
        res.setHeader('Content-Type','application/json');
        res.json(promos);
      },(err)=>next(err))
      .catch((err)=>next(err))
  })
  
.post(authenticate.verfyUser,authenticate.verifyAdmin, (req, res, next) => {
  Promotions.create(req.body)
   .then((promos)=>{

    console.log('Promotion Created',promos);
    res.statusCode=200;
    res.setHeader('Content-Type','application/json');
    res.json(promos);
    
   },(err)=>next(err))
   .catch((err)=>next(err))
  })
  
  .put(authenticate.verfyUser,authenticate.verifyAdmin,(req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /promotions');
  })
   
  .delete(authenticate.verfyUser,authenticate.verifyAdmin, (req, res, next) => {
    Promotions.remove({})
     .then((resp)=>{
      res.statusCode=200;
    res.setHeader('Content-Type','application/json');
    res.json(resp);
     },(err)=>next(err))
     .catch((err)=>next(err))
  });


// (/) promoId  point
promoRouter.route('/:promoId')
 .get( (req,res,next) => {
  Promotions.findById(req.params.promoId)
    .then((promos)=>{
      res.statusCode=200;
      res.setHeader('Content-Type','application/json');
      res.json(promos);
      
     },(err)=>next(err))
     .catch((err)=>next(err))
    
})

.post(authenticate.verfyUser,authenticate.verifyAdmin, (req, res, next) => {
  res.statusCode = 403;
  res.end('POST operation not supported on /promotions/'+ req.params.promoId);
})

.put(authenticate.verfyUser,authenticate.verifyAdmin, (req, res, next) => {
  Promotions.findByIdAndUpdate(req.params.promoId,{
    $set:req.body
  },{new:true})
  .then((promos)=>{
    res.statusCode=200;
    res.setHeader('Content-Type','application/json');
    res.json(promos);
    
   },(err)=>next(err))
   .catch((err)=>next(err))
})

.delete( authenticate.verfyUser,authenticate.verifyAdmin,(req, res, next) => {
  Promotions.findByIdAndRemove(req.params.promoId)
   .then((resp)=>{
    res.statusCode=200;
  res.setHeader('Content-Type','application/json');
  res.json(resp);
   },(err)=>next(err))
   .catch((err)=>next(err))
});
  module.exports=promoRouter;
  