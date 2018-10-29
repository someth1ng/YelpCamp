let mongoose = require("mongoose");
let Campground = require("./models/campground");
let Comment = require('./models/comment');

let data = [
    {
        name: 'River Moutain',
        image: 'https://images.pexels.com/photos/111362/pexels-photo-111362.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
        description: "there is a river"
    },
    {
        name: 'Forest Moutain',
        image: 'https://images.pexels.com/photos/116104/pexels-photo-116104.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
        description: "there is a table"
    },
    {
        name: 'Glenns Lake',
        image: 'https://images.pexels.com/photos/803226/pexels-photo-803226.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
        description: "there is a big lake"
    }
];

function seedDB() {
    Campground.remove({}, function (err) {
        if (err) {
            console.log(err);
        }
        console.log("removed campgrounds!");

        // add a few campgrounds
        data.forEach(seed => {
            Campground.create(seed, function (err, campground) {
                if (err) {
                    console.log(err);
                } else {
                    console.log('added a campground!');
                    // create a comment
                    Comment.create(
                        {
                            text: "This is a great place for camping!",
                            author: 'someone'
                        }, function(err, comment) {
                            if (err) {
                                console.log(err);
                            }
                            else {
                                campground.comments.push(comment);
                                campground.save();
                                console.log("Created new comment!");
                            }
                        }
                    );
                }
            });
        });
    });
}

module.exports = seedDB;