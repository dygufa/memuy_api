var mongoose = require("mongoose");
var Schema   = mongoose.Schema;
var File = require("./File");

var KeySchema = new Schema({
    key: String,
    files: [mongoose.model('File').schema]
}, {
    timestamps: true
})
mongoose.model('Key', KeySchema);
