var mongoose = require("mongoose");
var Schema   = mongoose.Schema;
var File = require("./File");

var RoomSchema = new Schema({
    room: String,
    status: Number,
    expiresOn: Date,
    files: [mongoose.model('File').schema],
    usedSpace: Number,
    maxSpace: Number
}, {
    timestamps: true
})
mongoose.model('Room', RoomSchema);
