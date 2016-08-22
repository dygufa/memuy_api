var mongoose = require("mongoose");
var Schema   = mongoose.Schema;

var WordSchema = new Schema({
    word: String,
    language : String,
    being_used: Boolean,
    created_at: Date
});
mongoose.model('Word', WordSchema);

var Word = mongoose.model("Word");

Word.findOne({}, function(err, res) {
	if (err) {
		return console.log(err);
	}

	if (!res) {
		var newWord = new Word({
			word: 'hi',
			language: 'eng',
			created_at: new Date()
		});

		newWord.save(function(err) {
			if (err) {
				console.log(err);
			}
		});
	}
});
