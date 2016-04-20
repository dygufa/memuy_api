var mongoose = require('mongoose'),
    Room = mongoose.model("Room"),
    Word = mongoose.model("Word"),
    ObjectId = mongoose.Types.ObjectId

module.exports = function(socket) {
	socket.on('newRoom', function() {
		generateRoomAndSave(function(roomObj) {
			var roomName = roomObj.room
			socket.myRoom = roomName
			socket.join(roomName)
			socket.emit('roomData', roomObj)
		})
	})

	socket.on('tryRoom', function(room, options) {
		tryRoom(room, function(status, roomObj) {
			if (status) {
				var roomName = roomObj.room
				if (socket.myRoom != roomName) {
					socket.leave(socket.myRoom)				
					socket.join(roomName)
				}
				socket.myRoom = roomName
				socket.emit('roomData', roomObj)
			} else {
				var errorCode
				if (options.type == 'url') {
					errorCode = 4041
				} else if (options.type == 'form') {
					errorCode = 4042
				}	

				socket.emit('roomError', errorCode)			
			}
		})
	})
}


tryRoom = function(room, callback) {
	Room.findOne({room: room}, function(err, roomObj) {
		callback((roomObj !== null), roomObj)
	})
}

getWord = function(callback) {
	Word.findOne('', function(err, resm) {
		callback(resm.word)
	});
}

generatePasscode = function() {
	return Math.floor(Math.random()*9000) + 1000;
}

generateRoom = function(callback) {
	getWord(function(word) {
		var room, passcode = generatePasscode()
		room = word + passcode
		callback(room)
	})
}

generateRoomAndSave = function(callback) {
	generateRoom(function(room) {
		var newRoom = new Room({
			room: room
		})

		newRoom.save(function(err) {
			if (err) throw err;

  			callback(newRoom)
		});
	})
}

// Create function to remove old rooms