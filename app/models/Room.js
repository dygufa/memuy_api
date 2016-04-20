var mongoose = require("mongoose");
var Schema   = mongoose.Schema;
var File = require("./File");

var RoomSchema = new Schema({
    room: String,
    files: [mongoose.model('File').schema]
}, {
    timestamps: true
})
mongoose.model('Room', RoomSchema);
