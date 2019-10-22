import * as fs from "fs";
import { Request, Response, NextFunction } from "express";
import { RoomModel as Room, FileModel as File } from "../models/";
import { upload } from "../helpers/s3";
import { IFileModel } from "../models/FileModel";
import { only } from "sanitize-object";
const md5File = require("md5-file");

export const _sanitizeFile = (room: IFileModel) => {
    const sanitizer = only("name", "location", "size", "mimetype", "hash");
    return sanitizer(room);
};

export const addFile = (io: SocketIO.Server) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        const roomName = req.body.roomName;
        const file = req.file;

        if (!file) {
            res.status(422).json({
                status: "fail",
                error: {
                    name: "fileMissing",
                    message: "The file is missing",
                },
            });
        }

        const room = await Room.findOne({ name: roomName });

        if (!room) {
            res.status(422).json({
                status: "fail",
                error: {
                    name: "invalidRoom",
                    message: "Invalid room",
                },
            });
        }

        const md5Hash = md5File.sync(file.path);

        console.log(md5Hash);

        const s3File = await upload(file);
        // Removing local file
        fs.unlink(file.path, err => {
            if (err) {
                console.log(err);
            }
        });

        const newFile = new File({
            name: s3File.Key,
            originalName: file.originalname,
            location: s3File.Location,
            size: file.size,
            mimetype: file.mimetype,
            hash: md5Hash,
        });

        Room.findOneAndUpdate(
            { name: roomName },
            {
                $push: { files: newFile },
                $inc: { usedSpace: file.size },
            },
            { new: true },
            (err, model) => {
                io.to(roomName).emit("newFile", {
                    roomName,
                    file: _sanitizeFile(newFile.toObject() as IFileModel),
                });

                res.json({
                    status: "success",
                    data: _sanitizeFile(newFile.toObject() as IFileModel),
                });
            },
        );
    };
};

export const updateFile = (io: SocketIO.Server) => {
    return (req: Request, res: Response, next: NextFunction) => {};
};

export const deleteFile = (io: SocketIO.Server) => {
    return (req: Request, res: Response, next: NextFunction) => {};
};
