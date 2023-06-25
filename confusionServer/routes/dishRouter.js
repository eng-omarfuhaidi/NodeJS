const express = require('express');
const bodyParser=require('body-parser');

const mongoose= require('mongoose');

const authenticate = require('../models/authenticate')

const Dishes=require('../models/dishes');

const dishRouter = express.Router();
dishRouter.use(bodyParser.json());
// (/) end point
dishRouter.route('/')
  
  .get((req,res,next) => {
      Dishes.find({}).populate('comments.author')
      
      .then((dishes)=>{
        res.statusCode=200;
        res.setHeader('Content-Type','application/json');
        res.json(dishes);
      },(err)=>next(err))
      .catch((err)=>next(err))
  })
  
.post(authenticate.verfyUser, authenticate.verifyAdmin,(req, res, next) => {
   Dishes.create(req.body)
   .then((dish)=>{

    console.log('Dish Created',dish);
    res.statusCode=200;
    res.setHeader('Content-Type','application/json');
    res.json(dish);
    
   },(err)=>next(err))
   .catch((err)=>next(err))
  })
  
  .put(authenticate.verfyUser,authenticate.verifyAdmin,(req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /dishes');
  })
   
  .delete( authenticate.verfyUser,authenticate.verifyAdmin,(req, res, next) => {
     Dishes.remove({})
     .then((resp)=>{
      res.statusCode=200;
    res.setHeader('Content-Type','application/json');
    res.json(resp);
     },(err)=>next(err))
     .catch((err)=>next(err))
  });


// (/) dishId point
  dishRouter.route('/:dishId')
 .get( (req,res,next) => {
    Dishes.findById(req.params.dishId).populate('comments.author')
    .then((dish)=>{
      res.statusCode=200;
      res.setHeader('Content-Type','application/json');
      res.json(dish);
      
     },(err)=>next(err))
     .catch((err)=>next(err))
    
})

.post( authenticate.verfyUser,authenticate.verifyAdmin,(req, res, next) => {
  res.statusCode = 403;
  res.end('POST operation not supported on /dishes/'+ req.params.dishId);
})

.put( authenticate.verfyUser,authenticate.verifyAdmin,(req, res, next) => {
  Dishes.findByIdAndUpdate(req.params.dishId,{
    $set:req.body
  },{new:true})
  .then((dish)=>{
    res.statusCode=200;
    res.setHeader('Content-Type','application/json');
    res.json(dish);
    
   },(err)=>next(err))
   .catch((err)=>next(err))
})

.delete( authenticate.verfyUser,authenticate.verifyAdmin,(req, res, next) => {
   Dishes.findByIdAndRemove(req.params.dishId)
   .then((resp)=>{
    res.statusCode=200;
  res.setHeader('Content-Type','application/json');
  res.json(resp);
   },(err)=>next(err))
   .catch((err)=>next(err))
});


/* REST API on comments*/ 


dishRouter.route('/:dishId/comments')
  //get
  .get((req,res,next) => {
      Dishes.findById(req.params.dishId).populate('comments.author')
      .then((dish)=>{
        if(dish != null)
        {
          res.statusCode=200;
          res.setHeader('Content-Type','application/json');
          res.json(dish.comments);
        }
        else
        {
          err=new Error('Dish '+ req.params.dishId+ 'not found');
          err.status=404;
          return  next(err);
        }
       
      },(err)=>next(err))
      .catch((err)=>next(err))
  })

  //post
.post(authenticate.verfyUser, (req, res, next) => {
  Dishes.findById(req.params.dishId)
   .then((dish)=>{

    if(dish != null)
    {
     req.body.author=req.user._id;
      dish.comments.push(req.body);
      dish.save()
      .then((dish)=>{
        Dishes.findById(dish._id)
        .populate('comments.author')
        .then((dish)=>{
          res.statusCode=200;
          res.setHeader('Content-Type','application/json');
          res.json(dish);
        })
       
      },(err)=>next(err));
     
    }
    else
    {
      err=new Error('Dish '+ req.params.dishId+ 'not found');
      err.status=404;
      return  next(err);
    }
    
   },(err)=>next(err))
   .catch((err)=>next(err))
  })

  //put
  
  .put(authenticate.verfyUser,(req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /dishes'
    +req.params.dishId + '/comments');
  })
   
  .delete(authenticate.verfyUser,authenticate.verifyAdmin, (req, res, next) => {
    Dishes.findById(req.params.dishId)
     .then((dish)=>{
      if(dish != null)
      {
       for (var i =(dish.comments.length-1);i>=0;i--){
        dish.comments.id(dish.comments[i]._id).remove();
       }
       dish.save()
       .then((dish)=>{
         res.statusCode=200;
         res.setHeader('Content-Type','application/json');
         res.json(dish);
       },(err)=>next(err));
       
      }
      else
      {
        err=new Error('Dish '+ req.params.dishId+ 'not found');
        err.status=404;
        return  next(err);
      }
      
     },(err)=>next(err))
     .catch((err)=>next(err))
  });


// (/) dishId point
  dishRouter.route('/:dishId/comments/:commentId')
 .get( (req,res,next) => {
    Dishes.findById(req.params.dishId).populate('comments.author')
    .then((dish)=>{
      if(dish != null && dish.comments.id(req.params.commentId) !=null)
      {
        res.statusCode=200;
        res.setHeader('Content-Type','application/json');
        res.json(dish.comments.id(req.params.commentId) );
      }
      else if (dish == null)
      {
        err=new Error('Dish '+ req.params.dishId+ 'not found');
        err.status=404;
        return  next(err);
      }
      else
      {
        err=new Error('Comment  '+ req.params.commentId+ 'not found');
        err.status=404;
        return  next(err);
      }
     },(err)=>next(err))
     .catch((err)=>next(err))
    
})


//post 
.post( authenticate.verfyUser,(req, res, next) => {
  res.statusCode = 403;
  res.end('POST operation not supported on /dishes/'+ req.params.dishId
  + '/comments' + req.params.commentId);
})

//put
/*
.put( authenticate.verfyUser,(req, res, next) => {
  Dishes.findById(req.params.dishId)
  .then((dish)=>{
    if(dish != null && dish.comments.id(req.params.commentId) !=null && req.user._id.equals(dish.comments.author))
    {
      if(req.body.rating){

        dish.comments.id(req.params.commentId).rating = req.body.rating;

      }
      if(req.body.comment){

        dish.comments.id(req.params.commentId).comment = req.body.comment;
      }
      dish.save()
      .then((dish)=>{
        Dishes.findById(dish._id).populate('comments.author')
        .then((dish)=>{
          res.statusCode=200;
          res.setHeader('Content-Type','application/json');
          res.json(dish);

        })
      
      },(err)=>next(err));
    }
    else if (dish == null)
    {
      err=new Error('Dish '+ req.params.dishId+ 'not found');
      err.status=404;
      return  next(err);
    }
    else if (req.user._id != dish.comments.author)
    {
      err=new Error('You are not authorized to  update this comment');
      err.status=404;
      return  next(err);
    }

    else
    {
      err=new Error('Comment  '+ req.params.commentId+ 'not found');
      err.status=404;
      return  next(err);
    }
   },(err)=>next(err))
   .catch((err)=>next(err))
})

.delete( authenticate.verfyUser,(req, res, next) => {
  Dishes.findById(req.params.dishId)
     .then((dish)=>{
      if(dish != null && dish.comments.id(req.params.commentId) !=null && req.user._id.equals(dish.comments.author) )
      {
      
        dish.comments.id(req.params.commentId).remove();
       
       dish.save()
       .then((dish)=>{
        Dishes.findById(dish._id).populate('comments.author')
        .then((dish)=>{
          res.statusCode=200;
          res.setHeader('Content-Type','application/json');
          res.json(dish);

        })
       },(err)=>next(err));
       
      }
      else if (dish == null)
      {
        err=new Error('Dish '+ req.params.dishId+ 'not found');
        err.status=404;
        return  next(err);
      }


      else if (req.user._id!=dish.comments.author)
      {
        err=new Error('You are not authorized to  Delete this comment');
        err.status=404;
        return  next(err);
      }
      else
      {
        err=new Error('Comment  '+ req.params.commentId+ 'not found');
        err.status=404;
        return  next(err);
      } 
      
     },(err)=>next(err))
   .catch((err)=>next(err))
});

*/

.put(authenticate.verfyUser, (req, res, next) => {
  Dishes.findById(req.params.dishId)
  .then((dish) => {
    if (dish != null && dish.comments.id(req.params.commentId) != null) {
      const commentAuthorId = dish.comments.id(req.params.commentId).author;
      if (commentAuthorId.equals(req.user._id)) {
        if (req.body.rating) {
          dish.comments.id(req.params.commentId).rating = req.body.rating;
        }
        if (req.body.comment) {
          dish.comments.id(req.params.commentId).comment = req.body.comment;
        }
        dish.save()
        .then((dish) => {
          Dishes.findById(dish._id)
          .populate('comments.author')
          .then((dish) => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(dish);
          });
        }, (err) => next(err));
      } else {
        const err = new Error('You are not authorized to update this comment!');
        err.status = 403;
        return next(err);
      }
    } else {
      const err = new Error(`Dish ${req.params.dishId} or comment ${req.params.commentId} not found!`);
      err.status = 404;
      return next(err);
    }
  }, (err) => next(err))
  .catch((err) => next(err));
})

.delete(authenticate.verfyUser, (req, res, next) => {
  Dishes.findById(req.params.dishId)
  .then((dish) => {
    if (dish != null && dish.comments.id(req.params.commentId) != null) {
      const commentAuthorId = dish.comments.id(req.params.commentId).author;
      if (commentAuthorId.equals(req.user._id)) {
        dish.comments.id(req.params.commentId).remove();
        dish.save()
        .then((dish) => {
          Dishes.findById(dish._id)
          .populate('comments.author')
          .then((dish) => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(dish);
          });
        }, (err) => next(err));
      } else {
        const err = new Error('You are not authorized to delete this comment!');
        err.status = 403;
        return next(err);
      }
    } else {
      const err = new Error(`Dish ${req.params.dishId} or comment ${req.params.commentId} not found!`);
      err.status = 404;
      return next(err);
    }
  }, (err) => next(err))
  .catch((err) => next(err));
});


  module.exports=dishRouter;
  