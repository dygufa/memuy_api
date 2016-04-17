var mongoose = require("mongoose");
var Schema   = mongoose.Schema;

var FileSchema = new Schema({
    file_name: String,
    created_at: Date,
});
mongoose.model('File', FileSchema);