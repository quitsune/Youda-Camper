var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");
var middleware = require("../middleware");


router.get('/', (req, res) => {
    res.render('home');
  });


  //AUTH ROUTES
  router.get('/register', (req, res) => {
    res.render('register');
  });


  router.post('/register', (req, res) => {

    
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err,User){
      if(err){

        req.flash("error", err.message);
        return res.render("register");
      }
        
        
          passport.authenticate("local")(req,res,function(){
            res.redirect("/campgrounds");
         
        });

    });
   });


   router.get('/login', (req, res) => {
    res.render('login');
  });


  router.post('/login',passport.authenticate("local",
  {
    successRedirect: "/campgrounds",
    failureRedirect : "/login"
  }) ,(req, res) => {

    
   
   });

   router.get('/logout', (req, res) => {
     req.logout();
     req.flash("success","Successfully logged out");
    res.redirect('/campgrounds');
  });
  
  

  module.exports = router;