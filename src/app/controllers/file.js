var fs = require('fs'),
	mongoose = require('mongoose'),
    Room = mongoose.model("Room"),
    File = mongoose.model("File"),
    ObjectId = mongoose.Types.ObjectId,
    aws         = require('aws-sdk'),
    slug        = require('slug'),
    mime        = require('mime-types'),
    S3_BUCKET   = process.env.S3_BUCKET,
    Promise     = require('bluebird');


function uploadFileToS3(data, callback) {
    var file            = data.file,
    	room 			= data.room,
        filename        = slug(file.originalname.replace(/\.[^/.]+$/, "")),
        extension       = mime.extension(file.mimetype),
        newFilename     = 'r' + room + '-' + Date.now().toString() + '-' + filename + '.' + extension;

    var fileStream = fs.createReadStream(file.path);

    var s3obj = new aws.S3({
        params: {
            Bucket: S3_BUCKET,
            Key: newFilename,
            ContentType: file.mimetype,
            ACL: 'public-read'
        }
    });

    return new Promise(function(resolve, reject) {
        s3obj.upload({Body: fileStream}).send(function(err, data) {
            if (err) {
                return reject(err);
            }

            return resolve(data);
        });
    });
}

exports.addFile = function(io) {
	return function(req, res, next) {
		var room = req.body.roomName,
			identifier = req.body.identifier,
			file = req.file;

		uploadFileToS3({
            file: file,
            room: room
        }).then(function(fileS3) {
        	fs.unlink(file.path);

        	var newFile = new File({
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
		        {safe: true, new : true},
		        function(err, model) {
		            io.to(room).emit('newFile', {file: newFile, identifier: identifier})
		            res.send({ok: true, file: newFile})
		        }
		    );
        });
	}
}

exports.updateFile = function(io) {
	return function(req, res, next) {

	}
}

exports.deleteFile = function(io) {
	return function(req, res, next) {

	}
}
