var mongoose = require("mongoose");
var Schema   = mongoose.Schema;
var File = require("./File");

var KeySchema = new Schema({
    word: String,
    passcode : String,
    local_server_adress: String,
    device_id: String,
    created_at: Date,
    files: [mongoose.model('File').schema]
});
mongoose.model('Key', KeySchema);
