var Campground = require("../models/campground");
var Comment = require("../models/comment");
//all middleware are here 

var middlewareObj = {}; 
middlewareObj.checkCampgroundOwnership = function(req, res, next) {
	//authorization if author of campgrounds only

	//is user logged in
	if (req.isAuthenticated()) {
		Campground.findById(req.params.id, function(err, foundCampground) {
			if (err) {
				req.flash("error", "Campground not found");
				res.redirect('back');
			} else {
				//does the user own the campground
				if (foundCamground.author.id.equals(req.user._id)) {
					next();
				} else {
					req.flash("error", "You don't have permission to do that");
					res.redirect('back');
				}
			}
		});
	} else {
		req.flash("error", "You need to be logged in to do that");
		//put the user back to his previous page
		res.redirect('back');
	}
};
	
	
	
middlewareObj.checkCommentOwnership = function(req, res, next) {
	//authorization if author of comment only

	//is user logged in
	if (req.isAuthenticated()) {
		Comment.findById(req.params.comment_id, function(err, foundComment) {
			if (err) {
				res.redirect('back');
			} else {
				//does the user own the comment
				if (foundComment.author.id.equals(req.user._id)) {
					next();
				} else {
						req.flash("error", "You don't have permission to do that");
					res.redirect('back');
				}
			}
		});
	} else {
			req.flash("error", "You need to be logged in to do that");
		//put the user back to his previous page
		res.redirect('back');
	}
};



middlewareObj.isLoggedIn = function(req, res, next){
	
	if(req.isAuthenticated()){
		return next();
	}
	req.flash("error", "You need to be logged in to do that");
	res.redirect("/login");	
}




module.exports = middlewareObj;
