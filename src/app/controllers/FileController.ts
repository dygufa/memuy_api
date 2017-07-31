import fs from "fs";
import mongoose from "mongoose";
import { Request, Response, NextFunction } from "express";
import { RoomModel as Room, FileModel as File} from "../models";
const ObjectId = mongoose.Types.ObjectId;

const aws = require("aws-sdk");
const slug = require("slug");
const mime = require("mime-types");

const S3_BUCKET   = process.env.S3_BUCKET;


function uploadFileToS3(data: any, callback?: any) {
    let file            = data.file,
    	room 			= data.room,
        filename        = slug(file.originalname.replace(/\.[^/.]+$/, "")),
        extension       = mime.extension(file.mimetype),
        newFilename     = 'r' + room + '-' + Date.now().toString() + '-' + filename + '.' + extension;

    let fileStream = fs.createReadStream(file.path);

    let s3obj = new aws.S3({
        params: {
            Bucket: S3_BUCKET,
            Key: newFilename,
            ContentType: file.mimetype,
            ACL: 'public-read'
        }
    });

    return new Promise(function(resolve, reject) {
        s3obj.upload({
			Body: fileStream
		}).send(function(err: any, data: any) {
            if (err) {
                return reject(err);
            }

            return resolve(data);
        });
    });
}

export function addFile(io: any) {
	return function(req: any, res: any, next: any) {
		let room = req.body.roomName,
			identifier = req.body.identifier,
			file = req.file;

		uploadFileToS3({
            file: file,
            room: room
        }).then(function(fileS3: any) {
        	fs.unlink(file.path);

        	let newFile = new File({
				name: fileS3.key,
				originalName: file.originalname,
				location: fileS3.Location,
				size: file.size,
				mimetype: file.mimetype
			});

        	Room.findOneAndUpdate(
		        {room: room},
		        {
					$push: {'files': newFile},
					$inc: {'usedSpace': file.size}
				},
		        {new : true},
		        function(err: any, model: any) {
		            io.to(room).emit('newFile', {file: newFile, identifier: identifier})
		            res.send({ok: true, file: newFile})
		        }
		    );
        });
	}
}

export function updateFile(io: any) {
	return function(req: Request, res: Response, next: NextFunction) {

	}
}

export function deleteFile(io: any) {
	return function(req: Request, res: Response, next: NextFunction) {

	}
}
