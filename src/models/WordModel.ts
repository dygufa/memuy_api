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

