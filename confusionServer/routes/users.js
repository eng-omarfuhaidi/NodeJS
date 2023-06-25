var express = require('express');

const bodyParser =require('body-parser');

var User= require('../models/user');

var passport =require('passport');

var authenticate = require('../models/authenticate')
var router = express.Router();
var admin= false;
router.use(bodyParser.json());

/* GET users listing. */
router.get('/', authenticate.verfyUser,authenticate.verifyAdmin,function(req, res, next) {
  User.find({})
  .then((users)=>
  {
    res.statusCode=200;
    res.setHeader('Content-Type','application/json');
    res.json(users);

  },(err)=>next(err)).catch((err)=>next(err))
});


router.post('/signup', (req, res, next)=> {
  User.register(new User({username: req.body.username}),
  req.body.password ,(err,user)=>
  {
    if(err){
      res.statusCode=500;
      res.setHeader('Content-Type','application/json');
      res.json({err:err});
    }
    else{
      if (req.body.firstname)
      user.firstname= req.body.firstname;
      if (req.body.lastname)
      user.lastname= req.body.firstname;
      user.save((err,user)=>{
        if (err)
        {

          res.statusCode=500;
          res.setHeader('Content-Type','application/json');
          res.json({err:err});
          return;
        }
        passport.authenticate('local')(req,res,()=>{
          res.statusCode=200;
          res.setHeader('Content-Type','application/json');
          res.json({success:true,status:'Registration Successfull'});
         });
      });
 
    }
  });
});

router.post('/login', passport.authenticate('local'), (req, res) => {
  var token = authenticate.getToken({_id: req.user._id});
  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json');
  res.json({success: true, token: token, status: 'You are successfully logged in!'});
});

router.get('/logout',passport.authenticate('local'),(req,res)=>{
 
  if (req.session){
    req.session.destroy();
    res.clearCookie('session_id');
    res.redirect('/');
  }
  else{
    var err = new Error('You are not login');
    err.statusCode = 403;
    next(err);
  }
});

module.exports = router;
