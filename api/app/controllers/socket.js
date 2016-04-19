var mongoose = require('mongoose'),
    Key = mongoose.model("Key"),
    Word = mongoose.model("Word"),
    ObjectId = mongoose.Types.ObjectId

module.exports = function(socket) {
	generateKey(function(key) {
		socket.join('ownerKey-' + key)
		socket.emit('key', key)
	})

	socket.on('tryKey', function(key) {
		
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

generateKey = function(callback) {
	getWord(function(word) {
		var key, passcode = generatePasscode()
		key = word + passcode
		callback(key)
	})
}