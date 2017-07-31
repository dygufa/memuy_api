import mongoose from "mongoose";
var Schema = mongoose.Schema;
// import _ from "./FileModel";

const RoomSchema = new Schema({
    room: String,
    status: Number,
    expiresOn: Date,
    files: [mongoose.model("File").schema],
    usedSpace: Number,
    maxSpace: Number
}, {
    timestamps: true
});

const Room = mongoose.model("Room", RoomSchema);
export default Room;
