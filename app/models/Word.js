var mongoose = require("mongoose");
var Schema   = mongoose.Schema;

var WordSchema = new Schema({
    word: String,
    language : String,
    being_used: Boolean,
    created_at: Date
});
mongoose.model('Word', WordSchema);
