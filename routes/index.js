let express = require('express');
let router = express.Router();
let passport = require('passport');
let User = require('../models/user');

// Root Routes
router.get('/', function (req, res) {
    res.render('landing');
});

//show register form
router.get('/register', function (req, res) {
    res.render('register');
});

//handle sign up logic
router.post('/register', function (req, res) {
    User.register(new User({ username: req.body.username }), req.body.password, function (err, user) {
        if (err) {
            console.log(err);
            return res.render('register');
        }
        passport.authenticate('local')(req, res, function () {
            res.redirect('/campgrounds');
        });
    });
});

// show login form
router.get('/login', function (req, res) {
    res.render('login');
});

// handle login logic  
router.post('/login', passport.authenticate('local', {
    successRedirect: '/campgrounds',
    failureRedirect: '/login'
}), function (req, res) {

});

// logout route
router.get('/logout', function (req, res) {
    req.logout();
    req.flash('success', 'YOU HAVE LOGGED OUT!');
    req.session.save(function(err){
        if (err) {
            console.log(err);
        }
        else 
            res.redirect('/campgrounds');
    });
});

// Middleware
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login');
}

module.exports = router;