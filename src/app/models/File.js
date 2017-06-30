var mongoose = require("mongoose");
var Schema   = mongoose.Schema;

var FileSchema = new Schema({
    name: String,
    size: Number,
    mimetype: String,
    originalName: String,
    location: String
}, {
    timestamps: true
})
mongoose.model('File', FileSchema);
