var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
var middleware = require("../middleware");

router.get('/', (req, res) => {
  
    Campground.find({}, function(err,campgrounds){
      if(err){
        console.log(err);
      }
      else{
        res.render('campgrounds/index',{campgrounds :campgrounds, currentUser : req.user});
      }

    });

});
  router.get('/new',middleware.isLoggedIn, (req, res) => {
    res.render('campgrounds/new');
  });

  router.post('/', middleware.isLoggedIn,(req, res) => {

    var  name = req.body.name;
    var image = req.body.image;
    var description = req.body.description;
    var author = {
        
        id : req.user._id,
        username : req.user.username
    };
    var newCamp = { name :name, image : image, description : description, author :author};
    Campground.create(newCamp,function(err,newlyCreated){
        if(err){
           console.log(err);
        }else{
          res.redirect("/campgrounds");
        }
    
      });
    
   
  });

  

  router.get('/:id',function(req, res)  {


     //res.send(req.params);

    Campground.findById(req.params.id).populate("comments").exec( function(err, foundCampground){
      if(err || !foundCampground){
        req.flash("error", "Campground not found");
        res.redirect("back");
     }else{
     res.render('campgrounds/show',{campground :foundCampground});
      
     }
    });
    
  });

  router.get('/:id/edit',middleware.checkCampgroundOwnership,function(req, res)  {

    Campground.findById(req.params.id,function(err, foundCampground){
      if(err){
        console.log(err);
     }else{
     res.render('campgrounds/edit',{campground : foundCampground});
      
     }
    });
    
});

router.put('/:id',middleware.checkCampgroundOwnership,function(req, res)  {

  Campground.findByIdAndUpdate(req.params.id,req.body.campground,function(err, updatedCampground){
    if(err){
      res.redirect("/campgrounds");
   }else{
   res.render('/campgrounds/'+req.params.id);
    
   }
  });
  
});

router.delete('/:id',middleware.checkCampgroundOwnership,function(req, res)  {

  
  Campground.findByIdAndRemove(req.params.id, function(err){

    if(err){

      res.redirect("/campgrounds");
    }
    else{
      res.redirect("/campgrounds");
    }
  });

});


  module.exports = router;