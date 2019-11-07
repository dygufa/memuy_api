import * as mongoose from "mongoose";
const Schema = mongoose.Schema;

// console.log(mongoose, Schema)

export interface IFileModel extends mongoose.Document {
    name: string
    size: number
    mimetype: string
    originalName: string
    location: string
    hash: string
    createdAt: Date
    updatedAt: Date
}

const FileSchema = new Schema({
    name: String,
    size: Number,
    mimetype: String,
    originalName: String,
    location: String,
    hash: String
}, {
    timestamps: true
});

const File = mongoose.model<IFileModel>("File", FileSchema);
export default File;
