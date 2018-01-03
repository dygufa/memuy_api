import * as http from "http";
import * as express from "express";
import * as cors from "cors";
import * as bodyParser from "body-parser";
import * as multer from "multer";
import * as socketio from "socket.io";

require('dotenv').config({ silent: true });

require("./mongoose");

import { FileController, RoomController } from "./controllers/";

let app = express();
const server = http.createServer(app);

var cwd = process.cwd();
var upload = multer({dest: cwd + "/static_content/temporary_files"});

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

let socketio_options = {};
if (process.env.NODE_ENV == "development") {
    socketio_options = {"origins": "*:*"};
    // Avoiding EADDRINUSE with nodemon
    process.on('SIGUSR2', () => { 
        server.close(() => {
            console.log("closed");
        }); 
        process.exit(0); 
    });
}
socketio(socketio_options);
const io = socketio.listen(server);

// io.on("connection", controllers.socket);

app.get("/rooms/:id", RoomController.getRoom(io));
app.post("/rooms", RoomController.createRoom(io));

app.post("/files", upload.single("file"), FileController.addFile(io));
app.put("/files/:id", FileController.updateFile(io));
app.delete("/files/:id", FileController.deleteFile(io));

var port = process.env.PORT || 3000;

server.listen(port, (err: any) => {
    if (err) {
        console.error(err);
    } else {
        console.log("App is ready at : " + port);
    }
})

if (process.env.environment == "production") {
    process.on("uncaughtException", function (err) {
        console.error(JSON.parse(JSON.stringify(err, ["stack", "message", "inner"], 2)));
    })
}
