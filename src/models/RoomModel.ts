import * as mongoose from "mongoose";
var Schema = mongoose.Schema;

interface IRoomModel extends mongoose.Document {
    name: string
    status: string
    expiresOn: Date
    files: any
    usedSpace: number
    maxSpace: number
    createdAt: Date
    updatedAt: Date
}

const RoomSchema = new Schema({
    name: String,
    status: String,
    expiresOn: Date,
    files: [mongoose.model("File").schema],
    usedSpace: Number,
    maxSpace: Number
}, {
    timestamps: true
});

const Room = mongoose.model<IRoomModel>("Room", RoomSchema);
export default Room;
