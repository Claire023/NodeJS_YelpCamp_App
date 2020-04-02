var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");



router.get("/", function(req,res){
	res.render("landing");
});


//AUTH ROUTES
//show signup form 
router.get("/register", function(req,res){
	res.render("register");
});


//handle userSignup
router.post("/register", function(req,res){
	
	//on crée un user et on hashe le password
	var newUser = new User({username:req.body.username});
	User.register( newUser, req.body.password, 	function(err, user){
		if(err){
			 req.flash("error", err.message);
			console.log(err);
			return res.render('register');
		} 
			//permet au user de se loguer et gere la session 
			passport.authenticate("local")(req, res, function(){
				req.flash("success", "Welcome to yelpcamp" +user.username);
				res.redirect("/campgrounds");
			});
	});
	
});



//LOGIN ROUTES
//show login form 
router.get("/login", function(req,res){
	res.render("login");
});


//login logic
//middleware : code qui run avant la fin
router.post("/login", passport.authenticate("local", {
	successRedirect: "/campgrounds",
	failureRedirect: "/login"
	}), function(req,res){
	
});


router.get("/logout", function(req,res){
	req.logout();
	req.flash("success", "Logged you out !");
	res.redirect("/campgrounds");
});




module.exports = router;
