var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
var middleware = require("../middleware");





//see all campgrounds
router.get("/", function(req,res){
	//Get all campgrounds from DB
	Campground.find({},function(err, allCampgrounds){
		if(err){
			console.log(err);
		}else {
			res.render("campgrounds/index", {campgrounds:allCampgrounds, currentUser: req.user});
		}
	});
	
});


//create campgrounds
router.post("/", middleware.isLoggedIn, function(req,res){
var name = req.body.name;
var image = req.body.image;
var price = req.body.price;
var desc = req.body.description;
	var author = {
		id: req.user._id,
		username : req.user.username
	}
	
var newCampGround = {name : name, image : image, price: price, description : desc, author: author};
	//Create a new campground and add it DB 
	Campground.create(newCampGround, function(err, newlyCreated){
		if(err){
			console.log(err);
		}else {
			//redirect back to campground page
			res.redirect("/campgrounds");
		}
	});
	
});


//see new campgrounds
router.get("/new",middleware.isLoggedIn, function(req,res){
	res.render("campgrounds/new");
});



// SHOW - shows more info about one campground
router.get("/:id", function(req, res){
    //find the campground with provided ID
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
        if(err){
            console.log(err);
        } else {
            console.log(foundCampground)
            //render show template with that campground
            res.render("campgrounds/show", {campgrounds: foundCampground});
        }
    });
});

//EDIT CAMPGROUND ROUTE
router.get('/:id/edit', middleware.checkCampgroundOwnership, function(req, res) {
	Campground.findById(req.params.id, function(err, foundCampground) {
		res.render('campgrounds/edit', { campground: foundCampground });
	});
});



//UPDATE CAMPGROUND ROUTE
router.put("/:id", middleware.checkCampgroundOwnership, function(req,res){
	//find and update the correct campground
	Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
		if(err){
			res.redirect("/campgrounds");
		}else{
			res.redirect("/campgrounds/" + req.params.id);
		}
	});
	//redirect to show page 
});


//DESTROY CAMPGROUND ROUTE
router.delete('/:id', middleware.checkCampgroundOwnership, function(req, res) {
	//mongoose method
	Campground.findByIdAndRemove(req.params.id, function(err) {
		if (err) {
			res.redirect('/campgrounds');
		} else {
			res.redirect('/campgrounds');
		}
	});
});





module.exports = router;