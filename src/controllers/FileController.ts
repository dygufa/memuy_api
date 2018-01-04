import * as fs from "fs";
import { Request, Response, NextFunction } from "express";
import { RoomModel as Room, FileModel as File} from "../models/";
import { upload } from "../helpers/s3";
import { IFileModel } from "../models/FileModel";
import { only } from "sanitize-object";

export const _sanitizeFile = (room: IFileModel) => {
	const sanitizer = only("name", "location", "size", "mimetype");
	return sanitizer(room);
}

export const addFile = (io: SocketIO.Server) => {
	return async (req: Request, res: Response, next: NextFunction) => {
		const roomName = req.body.roomName;
		const identifier = req.body.identifier;
		const file = req.file;

		if (!file) {
			res.json({
				status: "fail",
				error: {
					name: "fileMissing",
					message: "The file is missing"
				}
			});
		}

		const room = await Room.findOne({ name: roomName });

		if (!room) {
			res.json({
				status: "fail",
				error: {
					name: "invalidRoom",
					message: "Invalid room"
				}
			});
		}

		const s3File = await upload(file);
		fs.unlink(file.path);

		let newFile = new File({
			name: s3File.Key,
			originalName: file.originalname,
			location: s3File.Location,
			size: file.size,
			mimetype: file.mimetype
		});

		Room.findOneAndUpdate(
			{ name: roomName },
			{
				$push: { 'files': newFile },
				$inc: { 'usedSpace': file.size }
			},
			{new : true},
			(err, model) => {
				io.to(roomName).emit('newFile', { 
					file: newFile, 
					identifier: identifier
				})
				res.json({
					status: "success", 
					data: newFile
				})
			}
		);
	}
}

export const updateFile = (io: SocketIO.Server) => {
	return (req: Request, res: Response, next: NextFunction) => {

	}
}

export const deleteFile = (io: SocketIO.Server) => {
	return (req: Request, res: Response, next: NextFunction) => {

	}
}
