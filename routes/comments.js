var express = require("express");
var router = express.Router({mergeParams:true});
var Campground = require("../models/campground");
var Comment = require("../models/comment");
var middleware = require("../middleware");



//see new comment
router.get("/new" ,middleware.isLoggedIn, function(req,res){
	Campground.findById(req.params.id, function(err, campgrounds){
		if(err){
			console.log(err);
		}else{
			res.render("comments/newComment", {campgrounds: campgrounds});
		}
	})

});


//create new comment
router.post("/", middleware.isLoggedIn, function(req, res){
   //lookup campground using ID
   Campground.findById(req.params.id, function(err, campgrounds){
       if(err){
           console.log(err);
           res.redirect("/campgrounds");
       } else {
        Comment.create(req.body.comment, function(err, comment){
           if(err){
			   req.flash("error", "something went wrong");
               console.log(err);
           } else {
			   //add username and id to comment
			   comment.author.id = req.user._id;
			   comment.author.username = req.user.username;
			   //save comment
			   comment.save();
               campgrounds.comments.push(comment);
               campgrounds.save();
			      req.flash("success", "Successfully added comment");
               res.redirect('/campgrounds/' + campgrounds._id);
           }
        });
       }
   });
});


//EDIT 
router.get("/:comment_id/edit", middleware.checkCommentOwnership, function(req, res){
	Comment.findById(req.params.comment_id, function(err, foundComment){
		if(err){
			res.redirect("back");
		}else{
			res.render("comments/edit", {campground_id: req.params.id, comment:foundComment});
		}
		
	});	
});



//UPDATE COMMENT
router.put("/:comment_id", middleware.checkCommentOwnership, function(req,res){
	Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedCommend){
		if(err){
			res.redirect("back");
		}else{
			res.redirect("/campgrounds/" +req.params.id);
		}
	});
});



//DELETE COMMENT
router.delete("/:comment_id", middleware.checkCommentOwnership, function(req, res){
	Comment.findByIdAndRemove(req.params.comment_id, function(err){
		if(err){
			res.redirect("back");
		} else {
			req.flash("success", "Successfully deleted comment");
			res.redirect("/campgrounds/" + req.params.id);
		}
	});
});



module.exports = router;

