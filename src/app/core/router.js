var dotenv              = require('dotenv').config(),
    express             = require('express'),
    cors                = require('cors'),
    app                 = express(),
    server              = require('http').Server(app);
    bodyParser          = require('body-parser'),
    multer              = require('multer'),
    fs                  = require('fs'),
    socketio_options    = {}


// Get base directory
var cwd = process.cwd();

// Set directory for temporary uploaded files
var upload = multer({dest: cwd + '/static_content/temporary_files'});

app.use(cors());

// to support JSON-encoded bodies
app.use(bodyParser.json());
// to support URL-encoded bodies
app.use(bodyParser.urlencoded({extended: true}));

if (process.env.NODE_ENV == 'dev') {
    socketio_options = {'origins': '*:*'};
}

var socketio = require('socket.io')(socketio_options),
    io = socketio.listen(server);

var controllers = {},
    controllers_path = process.cwd() + '/app/controllers'

fs.readdirSync(controllers_path).forEach(function (file) {
    if (file.indexOf('.js') != -1) {
        controllers[file.split('.')[0]] = require(controllers_path + '/' + file);
    }
})

io.on('connection', controllers.socket);

app.post("/files", upload.single('file'), controllers.file.addFile(io));
app.put("/files/:id", controllers.file.updateFile(io));
app.delete("/files/:id", controllers.file.deleteFile(io));

var port = process.env.PORT || 3000;

server.listen(port, function (err) {
    if (err) {
        console.error(err);
    } else {
        console.log('App is ready at : ' + port);
    }
})

if (process.env.environment == 'production') {
    process.on('uncaughtException', function (err) {
        console.error(JSON.parse(JSON.stringify(err, ['stack', 'message', 'inner'], 2)));
    })
}
