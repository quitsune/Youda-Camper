console.log("my first app");



var mongoose      = require("mongoose");
var flash         = require("connect-flash");
var express       = require("express");
var bodyParser    = require('body-parser');
var axios         = require("axios");
var app           = express();
var Campground    = require("./models/campground");
var Comment       = require("./models/comment");
var User          = require("./models/user");
var passport      = require("passport");
var LocalStrategy = require("passport-local");
var methodOverride= require("method-override");
const seedDB      = require("./seeds");

var commentRoutes = require("./routes/comments");
    campgroundRoutes = require("./routes/campgrounds");
    indexRoutes = require("./routes/index");

//seedDB();
mongoose.set('useNewUrlParser', true);
mongoose.set('useUnifiedTopology', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.connect("mongodb://localhost/youda_camper");
app.use(express.urlencoded({ extended: true }));
app.set("view engine","ejs");
app.use(express.static(__dirname+"/public"));
app.use(methodOverride("_method"));
app.use(flash());


//PASSPORT CONFIG
app.use(require("express-session")({
  secret : "the blades shadow",
  resave :false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req,res,next){

  res.locals.currentUser = req.user;
  res.locals.error     = req.flash("error");
  res.locals.success     = req.flash("success");
  next();
});


app.use(indexRoutes);
app.use("/campgrounds",campgroundRoutes);
app.use("/campgrounds/:id/comments",commentRoutes);

  app.listen(3000, () => {
    console.log(`Example app listening at http://localhost:3000`)
  });