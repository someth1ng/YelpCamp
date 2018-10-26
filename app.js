let express     = require('express'),
    bodyParser  = require('body-parser'),
    mongoose    = require('mongoose'),
    Campground  = require('./models/campground'),
    seedDB      = require('./seeds'),
    // Comment     = require("./models/user"),
    app         = express()

mongoose.connect("mongodb://localhost/YelpCamp", { useNewUrlParser: true });
app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs');
app.use(express.static('public'));
// seedDB();


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
            res.render('index', { campgrounds: c});
        }
    })
});

// NEW
app.get('/campgrounds/new', function(req, res) {
    res.render('new');
})

// SHOW - more info
app.get("/campgrounds/:id", function(req, res) {
    // find the campsound with provided id
    Campground.findById(req.params.id).populate("comments").exec(function(err, c) {
        if (err) {
            console.log(err);
        }
        else {
            console.log(c);
            res.render('show', {campground: c});        
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
   console.log(object);
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

app.listen(3000, process.env.IP, function() {
    console.log("The YelpCamp Servers Has Started!");
});