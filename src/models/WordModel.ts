import mongoose from "mongoose";
const Schema = mongoose.Schema;

export interface IWordModel extends mongoose.Document {
    word: string,
    language: string,
    createdAt: Date
    updatedAt: Date
}

const WordSchema = new Schema({
    word: String,
    language : String,
}, {
    timestamps: true
});

const Word = mongoose.model<IWordModel>("Word", WordSchema);
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

