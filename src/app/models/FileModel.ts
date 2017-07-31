import mongoose from "mongoose";
const Schema = mongoose.Schema;

const FileSchema = new Schema({
    name: String,
    size: Number,
    mimetype: String,
    originalName: String,
    location: String
}, {
    timestamps: true
});

const File = mongoose.model("File", FileSchema);
export default File;