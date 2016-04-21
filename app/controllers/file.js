var fs = require('fs'),
	mongoose = require('mongoose'),
    Room = mongoose.model("Room"),
    File = mongoose.model("File"),
    ObjectId = mongoose.Types.ObjectId


exports.addFile = function(io) {
	return function(req, res, next) {
		var room = req.body.roomName,
			identifier = req.body.identifier,
			file = req.files.file
		
		fs.readFile(file.path, function (err, data) {
			console.log(err);

			var newFileName = room + '-' + Date.now() + '-' + file.name.replace(/ /g, '_')
				newPath = process.cwd() + '/static_content/public/uploads/' + newFileName

			fs.writeFile(newPath, data, function (err) {
				console.log(err);
				newFile = new File({
					name: newFileName,
					originalName: file.name,
					size: file.size,
					type: file.type
				})

				Room.findOneAndUpdate(
			        {room: room},
			        {$push: {'files': newFile}},
			        {safe: true, new : true},
			        function(err, model) {
			            console.log(err);
			            io.to(room).emit('newFile', {file: newFile, identifier: identifier})
			            res.send({ok: true, file: newFile})
			        }
			    );
			});
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
