let express     = require('express'),
    bodyParser  = require('body-parser'),
    mongoose    = require('mongoose'),
    passport    = require('passport'),
    localStrategy = require('passport-local'),
    Campground  = require('./models/campground'),
    seedDB      = require('./seeds'),
    Comment     = require("./models/comment"),
    User        = require("./models/user"),
    app         = express();

mongoose.connect("mongodb://localhost/YelpCamp", { useNewUrlParser: true });
app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs');
app.use(express.static('public'));
//seedDB();

// PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret: "that's cu lua again",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next) {
    res.locals.currentUser = req.user;
    next();
})

app.get('/', function(req, res) {
    res.render('landing');
});

// INDEX
app.get("/campgrounds", function(req, res) {
    // Get all campgrounds from DB
    Campground.find({}, function(err, c) {
        if (err) {
            console.log(er);
        }
        else{
            res.render('campgrounds/index', { campgrounds: c, currentUser: req.user });
        }
    })
});

// NEW
app.get('/campgrounds/new', function(req, res) {
    res.render('campgrounds/new');
})

// SHOW - more info
app.get("/campgrounds/:id", function(req, res) {
    // find the campsound with provided id
    Campground.findById(req.params.id).populate("comments").exec(function(err, c) {
        if (err) {
            console.log(err);
        }
        else {
            //console.log(c);
            res.render('campgrounds/show', {campground: c});        
        }
    });
})

// CREATE
app.post('/campgrounds', function(req, res) {
   // get data from form and add to campgrounds arr
   let name = req.body.name;
   let image = req.body.image;
    let desc = req.body.desciption;
   let object = {name: name, image: image, description: desc};
//    console.log(object);
   // Save object to database
   Campground.create(object, function(err, _new) {
       if (err) {
           console.log(err);
           res.redirect('/campgrounds/new');
       }
       else{
           res.redirect('/campgrounds');
       }
   })
});

//====================================================
// COMMENT
//====================================================
app.get('/campgrounds/:id/comments/new', isLoggedIn, function(req, res) {
    Campground.findById(req.params.id, function(err, campground) {
        if (err) {
            console.log(err);
        } 
        else {
            res.render('comments/new', {campground: campground});
        }
    });
});

app.post('/campgrounds/:id/comments', isLoggedIn, function(req, res) {
    Campground.findById(req.params.id, function (err, campground) {
        if (err) {
            console.log("create comment error");
            console.log(err);
            res.redirect('/campgrounds');
        }
        else {
            Comment.create(req.body.comment, function(err, comment) {
                if (err) {
                    console.log(err);
                }
                else {
                    campground.comments.push(comment);
                    campground.save();
                    res.redirect('/campgrounds/' + req.params.id);
                }
            });
        }
    });
});

//=============
// AUTH ROUTES
//=============

//show register form
app.get('/register', function(req, res) {
    res.render('register');
});

//handle sign up logic
app.post('/register', function(req, res) {
    User.register(new User({username: req.body.username}), req.body.password, function(err, user) {
        if (err) {
            console.log(err);
            return res.render('register');
        }
        passport.authenticate('local')(req, res, function() {
            res.redirect('/campgrounds');
        });
    });
});

// show login form
app.get('/login', function(req, res) {
    res.render('login');
});

// handle login logic  
app.post('/login', passport.authenticate('local', {
    successRedirect: '/campgrounds',
    failureRedirect: '/login'
}), function(req, res) {
    
});

app.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/campgrounds');
});

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login');
}

app.listen(3000, process.env.IP, function() {
    console.log("The YelpCamp Servers Has Started!");
});