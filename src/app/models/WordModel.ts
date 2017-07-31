import mongoose from "mongoose";
const Schema = mongoose.Schema;

const WordSchema = new Schema({
    word: String,
    language : String,
    being_used: Boolean,
    created_at: Date
});

const Word =  mongoose.model("Word", WordSchema);
export default Word;


// Word.findOne({}, function(err, res) {
// 	if (err) {
// 		return console.log(err);
// 	}

// 	if (!res) {
// 		const newWord = new Word({
// 			word: "hi",
// 			language: "eng",
// 			created_at: new Date()
// 		});

// 		newWord.save(function(err) {
// 			if (err) {
// 				console.log(err);
// 			}
// 		});
// 	}
// });

