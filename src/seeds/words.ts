require('dotenv').config({ silent: true });
import "../mongoose";
import { WordModel as Word} from "../models/";

Word.findOne({}, function(err, res) {
	if (err) {
		return console.log(err);
    }
    
    Word.insertMany([
        {
            word: "hi",
            language: "eng",
        },
        {
            word: "car",
            language: "eng",
        }
    ], function (err) {
        if (err) {
            console.log(err);
        }
    });
});