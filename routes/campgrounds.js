let express = require('express');
let router = express.Router();
let Campground = require("../models/campground");
let middleware = require("../middleware");

// INDEX
router.get("/", function (req, res) {
    // Get all campgrounds from DB
    Campground.find({}, function (err, c) {
        if (err) {
            console.log(err);
        }
        else {
            res.render('./campgrounds/index', { campgrounds: c, currentUser: req.user });
        }
    });
});

// NEW
router.get('/new', middleware.isLoggedIn, function (req, res) {
    res.render('campgrounds/new');
});

// SHOW - more info
router.get("/:id", function (req, res) {
    // find the campsound with provided id
    Campground.findById(req.params.id).populate("comments").exec(function (err, c) {
        if (err) {
            console.log(err);
        }
        else {
            //console.log(c);
            res.render('campgrounds/show', { campground: c });
        }
    });
});

// CREATE
router.post('/', middleware.isLoggedIn, function (req, res) {
    // get data from form and add to campgrounds arr
    let name = req.body.name;
    let image = req.body.image;
    let desc = req.body.desciption;
    let author = {
        id: req.user.id,
        username: req.user.username
    }
    let object = { name: name, image: image, description: desc, author: author };
    // Save object to database
    Campground.create(object, function (err, _new) {
        if (err) {
            console.log(err);
            res.redirect('/campgrounds/new');
        }
        else {
            res.redirect('/campgrounds');
        }
    });
});

// EDIT campground route
router.get('/:id/edit', middleware.checkCampgroundOwnership, function(req, res) {
    Campground.findById(req.params.id, function (err, foundCampground) {
        res.render('./campgrounds/edit', { campground: foundCampground });
    });
});

// UPDATE campground route
router.put('/:id', middleware.checkCampgroundOwnership, function(req, res) {
    Campground.findByIdAndUpdate(req.params.id, req.body.c, function(err, updatedCampground) {
       if (err) {
           console.log(err);
           res.redirect('/campgrounds');
       } else {
           res.redirect('/campgrounds/' + req.params.id);
       }
    });
});

// DESTROY CAMPGROUND ROUTE
router.delete('/:id', middleware.checkCampgroundOwnership, function(req, res) {
    Campground.findByIdAndDelete(req.params.id, function(err) {
        if (err) {
            console.log(err);
            res.redirect("/campgrounds");
        } else {
            res.redirect("/campgrounds");
        }
    });
});

module.exports = router;