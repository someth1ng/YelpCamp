let express         = require('express'),
    bodyParser      = require('body-parser'),
    mongoose        = require('mongoose'),
    passport        = require('passport'),
    localStrategy   = require('passport-local'),
    //seedDB          = require('./seeds'),
    User            = require("./models/user"),
    app             = express();

// requiring routes
let campgroundRoutes    = require("./routes/campgrounds"),
    commentRoutes       = require('./routes/comments'),
    indexRoutes         = require('./routes/index');

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

app.use(indexRoutes);
app.use('/campgrounds', campgroundRoutes);
app.use('/campgrounds/:id/comments', commentRoutes);

app.listen(3000, process.env.IP, function() {
    console.log("The YelpCamp Servers Has Started!");
});