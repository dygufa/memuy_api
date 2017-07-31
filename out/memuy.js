/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _stringify = __webpack_require__(1);

var _stringify2 = _interopRequireDefault(_stringify);

var _http = __webpack_require__(2);

var _http2 = _interopRequireDefault(_http);

var _express = __webpack_require__(3);

var _express2 = _interopRequireDefault(_express);

var _cors = __webpack_require__(4);

var _cors2 = _interopRequireDefault(_cors);

var _bodyParser = __webpack_require__(5);

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _multer = __webpack_require__(6);

var _multer2 = _interopRequireDefault(_multer);

var _socket = __webpack_require__(7);

var _socket2 = _interopRequireDefault(_socket);

var _controllers = __webpack_require__(8);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

__webpack_require__(24);

var app = (0, _express2.default)();
var server = _http2.default.createServer(app);
var socketio_options = {};
// Set directory for temporary uploaded files
var cwd = process.cwd();
var upload = (0, _multer2.default)({ dest: cwd + "/static_content/temporary_files" });
app.use((0, _cors2.default)());
// to support JSON-encoded bodies
app.use(_bodyParser2.default.json());
// to support URL-encoded bodies
app.use(_bodyParser2.default.urlencoded({ extended: true }));
if (process.env.NODE_ENV == "dev") {
    socketio_options = { "origins": "*:*" };
}
(0, _socket2.default)(socketio_options);
var io = _socket2.default.listen(server);
// io.on("connection", controllers.socket);
app.get("/rooms/:id", _controllers.RoomController.getRoom(io));
app.post("/rooms", _controllers.RoomController.createRoom(io));
app.post("/files", upload.single("file"), _controllers.FileController.addFile(io));
app.put("/files/:id", _controllers.FileController.updateFile(io));
app.delete("/files/:id", _controllers.FileController.deleteFile(io));
var port = process.env.PORT || 3000;
server.listen(port, function (err) {
    if (err) {
        console.error(err);
    } else {
        console.log("App is ready at : " + port);
    }
});
if (process.env.environment == "production") {
    process.on("uncaughtException", function (err) {
        console.error(JSON.parse((0, _stringify2.default)(err, ["stack", "message", "inner"], 2)));
    });
}

/***/ }),
/* 1 */
/***/ (function(module, exports) {

module.exports = require("babel-runtime/core-js/json/stringify");

/***/ }),
/* 2 */
/***/ (function(module, exports) {

module.exports = require("http");

/***/ }),
/* 3 */
/***/ (function(module, exports) {

module.exports = require("express");

/***/ }),
/* 4 */
/***/ (function(module, exports) {

module.exports = require("cors");

/***/ }),
/* 5 */
/***/ (function(module, exports) {

module.exports = require("body-parser");

/***/ }),
/* 6 */
/***/ (function(module, exports) {

module.exports = require("multer");

/***/ }),
/* 7 */
/***/ (function(module, exports) {

module.exports = require("socket.io");

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SocketController = exports.RoomController = exports.FileController = undefined;

var _FileController = __webpack_require__(9);

var FileController = _interopRequireWildcard(_FileController);

var _RoomController = __webpack_require__(16);

var RoomController = _interopRequireWildcard(_RoomController);

var _SocketController = __webpack_require__(17);

var SocketController = _interopRequireWildcard(_SocketController);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

exports.FileController = FileController;
exports.RoomController = RoomController;
exports.SocketController = SocketController;

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _promise = __webpack_require__(10);

var _promise2 = _interopRequireDefault(_promise);

exports.addFile = addFile;
exports.updateFile = updateFile;
exports.deleteFile = deleteFile;

var _fs = __webpack_require__(11);

var _fs2 = _interopRequireDefault(_fs);

var _mongoose = __webpack_require__(12);

var _mongoose2 = _interopRequireDefault(_mongoose);

var _models = __webpack_require__(18);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ObjectId = _mongoose2.default.Types.ObjectId;
var aws = __webpack_require__(13);
var slug = __webpack_require__(14);
var mime = __webpack_require__(15);
var S3_BUCKET = process.env.S3_BUCKET;
function uploadFileToS3(data, callback) {
    var file = data.file,
        room = data.room,
        filename = slug(file.originalname.replace(/\.[^/.]+$/, "")),
        extension = mime.extension(file.mimetype),
        newFilename = 'r' + room + '-' + Date.now().toString() + '-' + filename + '.' + extension;
    var fileStream = _fs2.default.createReadStream(file.path);
    var s3obj = new aws.S3({
        params: {
            Bucket: S3_BUCKET,
            Key: newFilename,
            ContentType: file.mimetype,
            ACL: 'public-read'
        }
    });
    return new _promise2.default(function (resolve, reject) {
        s3obj.upload({
            Body: fileStream
        }).send(function (err, data) {
            if (err) {
                return reject(err);
            }
            return resolve(data);
        });
    });
}
function addFile(io) {
    return function (req, res, next) {
        var room = req.body.roomName,
            identifier = req.body.identifier,
            file = req.file;
        uploadFileToS3({
            file: file,
            room: room
        }).then(function (fileS3) {
            _fs2.default.unlink(file.path);
            var newFile = new _models.FileModel({
                name: fileS3.key,
                originalName: file.originalname,
                location: fileS3.Location,
                size: file.size,
                mimetype: file.mimetype
            });
            _models.RoomModel.findOneAndUpdate({ room: room }, {
                $push: { 'files': newFile },
                $inc: { 'usedSpace': file.size }
            }, { new: true }, function (err, model) {
                io.to(room).emit('newFile', { file: newFile, identifier: identifier });
                res.send({ ok: true, file: newFile });
            });
        });
    };
}
function updateFile(io) {
    return function (req, res, next) {};
}
function deleteFile(io) {
    return function (req, res, next) {};
}

/***/ }),
/* 10 */
/***/ (function(module, exports) {

module.exports = require("babel-runtime/core-js/promise");

/***/ }),
/* 11 */
/***/ (function(module, exports) {

module.exports = require("fs");

/***/ }),
/* 12 */
/***/ (function(module, exports) {

module.exports = require("mongoose");

/***/ }),
/* 13 */
/***/ (function(module, exports) {

module.exports = require("aws-sdk");

/***/ }),
/* 14 */
/***/ (function(module, exports) {

module.exports = require("slug");

/***/ }),
/* 15 */
/***/ (function(module, exports) {

module.exports = require("mime-types");

/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _regenerator = __webpack_require__(22);

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = __webpack_require__(23);

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

exports.getRoom = getRoom;
exports.createRoom = createRoom;

var _models = __webpack_require__(18);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function getRoom(io) {
    return function () {
        var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(req, res, next) {
            var roomName, room;
            return _regenerator2.default.wrap(function _callee$(_context) {
                while (1) {
                    switch (_context.prev = _context.next) {
                        case 0:
                            roomName = req.params.id;
                            _context.next = 3;
                            return _models.RoomModel.findOne({ room: roomName });

                        case 3:
                            room = _context.sent;

                            if (!room) {
                                res.send({ status: "fail", error: {
                                        code: 1,
                                        message: "Sala não encontrada"
                                    } });
                            }
                            res.json({ status: "success", data: {
                                    room: room
                                } });

                        case 6:
                        case "end":
                            return _context.stop();
                    }
                }
            }, _callee, this);
        }));

        return function (_x, _x2, _x3) {
            return _ref.apply(this, arguments);
        };
    }();
}
function createRoom(io) {
    return function () {
        var _ref2 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee2(req, res, next) {
            var roomName, room, newRoom;
            return _regenerator2.default.wrap(function _callee2$(_context2) {
                while (1) {
                    switch (_context2.prev = _context2.next) {
                        case 0:
                            roomName = req.body.name;
                            _context2.next = 3;
                            return _models.RoomModel.findOne({ room: roomName });

                        case 3:
                            room = _context2.sent;

                            if (!room) {
                                _context2.next = 7;
                                break;
                            }

                            res.send({ status: "fail", error: {
                                    code: 2,
                                    message: "Nome de sala já em uso"
                                } });
                            return _context2.abrupt("return", false);

                        case 7:
                            newRoom = new _models.RoomModel({
                                room: roomName,
                                status: 1,
                                usedSpace: 0,
                                maxSpace: 100000000,
                                expiresOn: new Date(+new Date() + 24 * 60 * 60 * 1000) // will exprie in 24 hours
                            });
                            _context2.next = 10;
                            return newRoom.save();

                        case 10:
                        case "end":
                            return _context2.stop();
                    }
                }
            }, _callee2, this);
        }));

        return function (_x4, _x5, _x6) {
            return _ref2.apply(this, arguments);
        };
    }();
}

/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function () {};

/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.WordModel = exports.RoomModel = exports.FileModel = undefined;

var _FileModel = __webpack_require__(19);

var _FileModel2 = _interopRequireDefault(_FileModel);

var _RoomModel = __webpack_require__(20);

var _RoomModel2 = _interopRequireDefault(_RoomModel);

var _WordModel = __webpack_require__(21);

var _WordModel2 = _interopRequireDefault(_WordModel);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.FileModel = _FileModel2.default;
exports.RoomModel = _RoomModel2.default;
exports.WordModel = _WordModel2.default;

/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _mongoose = __webpack_require__(12);

var _mongoose2 = _interopRequireDefault(_mongoose);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Schema = _mongoose2.default.Schema;
var FileSchema = new Schema({
    name: String,
    size: Number,
    mimetype: String,
    originalName: String,
    location: String
}, {
    timestamps: true
});
var File = _mongoose2.default.model("File", FileSchema);
exports.default = File;

/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _mongoose = __webpack_require__(12);

var _mongoose2 = _interopRequireDefault(_mongoose);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Schema = _mongoose2.default.Schema;
// import _ from "./FileModel";
var RoomSchema = new Schema({
    room: String,
    status: Number,
    expiresOn: Date,
    files: [_mongoose2.default.model("File").schema],
    usedSpace: Number,
    maxSpace: Number
}, {
    timestamps: true
});
var Room = _mongoose2.default.model("Room", RoomSchema);
exports.default = Room;

/***/ }),
/* 21 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _mongoose = __webpack_require__(12);

var _mongoose2 = _interopRequireDefault(_mongoose);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Schema = _mongoose2.default.Schema;
var WordSchema = new Schema({
    word: String,
    language: String,
    being_used: Boolean,
    created_at: Date
});
var Word = _mongoose2.default.model("Word", WordSchema);
exports.default = Word;
// Word.findOne({}, function(err, res) {
// 	if (err) {
// 		return console.log(err);
// 	}
// 	if (!res) {
// 		const newWord = new Word({
// 			word: "hi",
// 			language: "eng",
// 			created_at: new Date()
// 		});
// 		newWord.save(function(err) {
// 			if (err) {
// 				console.log(err);
// 			}
// 		});
// 	}
// });

/***/ }),
/* 22 */
/***/ (function(module, exports) {

module.exports = require("babel-runtime/regenerator");

/***/ }),
/* 23 */
/***/ (function(module, exports) {

module.exports = require("babel-runtime/helpers/asyncToGenerator");

/***/ }),
/* 24 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _mongoose = __webpack_require__(12);

var _mongoose2 = _interopRequireDefault(_mongoose);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var MONGO_URL = process.env.MONGO_URL || "";
console.log("conectou?");
_mongoose2.default.connect(MONGO_URL, { server: { auto_reconnect: true } });
var db = _mongoose2.default.connection;
db.on("error", function (err) {
    console.error("MongoDB connection error:", err);
});
db.once("open", function callback() {
    console.info("MongoDB connection is established");
});
db.on("disconnected", function () {
    console.error("MongoDB disconnected!");
    _mongoose2.default.connect(MONGO_URL, { server: { auto_reconnect: true } });
});
db.on("reconnected", function () {
    console.info("MongoDB reconnected!");
});

/***/ })
/******/ ]);