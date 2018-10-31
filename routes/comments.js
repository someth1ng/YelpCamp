let express = require('express');
let router = express.Router({mergeParams: true});
let Campground = require("../models/campground");
let Comment = require("../models/comment");
let middleware = require("../middleware");

// Comments New
router.get('/new', middleware.isLoggedIn, function (req, res) {
    Campground.findById(req.params.id, function (err, campground) {
        if (err) {
            console.log(err);
        }
        else {
            res.render('comments/new', { campground: campground });
        }
    });
});

// Comments Create
router.post('/', middleware.isLoggedIn, function (req, res) {
    Campground.findById(req.params.id, function (err, campground) {
        if (err) {
            console.log("create comment error");
            console.log(err);
            res.redirect('/campgrounds');
        }
        else {
            Comment.create(req.body.comment, function (err, comment) {
                if (err) {
                    console.log(err);
                }
                else {
                    // add user and id to comment
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    // save comment
                    comment.save();
                    campground.comments.push(comment);
                    campground.save();
                    res.redirect('/campgrounds/' + req.params.id);
                }
            });
        }
    });
});

// EDIT
router.get('/:comment_id/edit', middleware.checkCommentOwnership, function(req, res) { 
    Comment.findById(req.params.comment_id, function(err, cmt) {
        res.render('comments/edit', { campground_id: req.params.id, comment: cmt });
    });
});

// UPDATE
router.put('/:comment_id', middleware.checkCommentOwnership, function(req, res) {
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment) {
        res.redirect('/campgrounds/' + req.params.id);
    });
});

// DESTROY
router.delete('/:comment_id', middleware.checkCommentOwnership, function(req, res) {
   Comment.findByIdAndDelete(req.params.comment_id, function(err) {
       if (err) {
           res.redirect('/campgrounds/' + req.params.id);
       }
       else {
           res.redirect('/campgrounds/' + req.params.id);
       }
   }) 
});

module.exports = router;