let express = require('express');
let router = express.Router();
let Campground = require("../models/campground");

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
    })
});

// NEW
router.get('/new', function (req, res) {
    res.render('campgrounds/new');
})

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
})

// CREATE
router.post('/', function (req, res) {
    // get data from form and add to campgrounds arr
    let name = req.body.name;
    let image = req.body.image;
    let desc = req.body.desciption;
    let object = { name: name, image: image, description: desc };
    //    console.log(object);
    // Save object to database
    Campground.create(object, function (err, _new) {
        if (err) {
            console.log(err);
            res.redirect('/campgrounds/new');
        }
        else {
            res.redirect('/campgrounds');
        }
    })
});

module.exports = router;