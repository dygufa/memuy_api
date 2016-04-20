var mongoose = require("mongoose");
var Schema   = mongoose.Schema;

var FileSchema = new Schema({
    name: String,
    size: Number,
    type: String,
    originalName: String
}, {
    timestamps: true
})
mongoose.model('File', FileSchema);