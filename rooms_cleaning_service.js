require("./app/core/mongoose");

var moment = require("moment"),
    mongoose = require("mongoose"),
    Room = mongoose.model("Room");

var now = moment();

Room.find({
    expiresOn: {
        $lt: now
    }
}).then(function(rooms) {
    console.log(rooms);
});
