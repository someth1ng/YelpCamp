let mongoose = require("mongoose");
let Campground = require("./models/campground");
let Comment = require('./models/comment');

let data = [
    {
        name: 'River Moutain',
        image: 'https://cdn.pixabay.com/photo/2017/07/17/16/21/nature-2512944_960_720.jpg',
        description: "there is a river"
    },
    {
        name: 'Forest Moutain',
        image: 'https://cdn.pixabay.com/photo/2015/07/09/01/59/picnic-table-837221_960_720.jpg',
        description: "there is a table"
    },
    {
        name: 'Glenns Lake',
        image: 'https://c2.staticflickr.com/8/7368/9811937955_03d073d6ef_b.jpg',
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