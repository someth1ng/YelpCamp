let express     = require('express'),
    bodyParser  = require('body-parser'),
    mongoose    = require('mongoose'),
    Campground  = require("./models/campground"),
    // Comment     = require("./models/user"),
    app         = express()

// connect database
mongoose.connect("mongodb://localhost/YelpCamp", { useNewUrlParser: true });

app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs');
app.use(express.static('public'));

//Schema Setup

// Campground.create({ 
//     name: 'Long Beaches', image: "https://cdn.pixabay.com/photo/2016/11/21/16/03/campfire-1846142_960_720.jpg",
//     description: "This is a beautiful place, xoxoxoxoxoxoxo"
// }, function(err, c) {
//     if (err) {
//         console.log(err);
//     }
//     else {
//         console.log(c);
//     }
// })

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
    Campground.findById(req.params.id, function(err, c) {
        if (err) {
            console.log(err);
        }
        else {
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