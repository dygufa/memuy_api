import * as http from "http";
import * as express from "express";
import * as cors from "cors";
import * as bodyParser from "body-parser";
import * as multer from "multer";
import * as socketio from "socket.io";
import { Request, Response, NextFunction } from "express";
require('dotenv').config({ silent: true });
import * as Raven from "raven";

Raven.config(process.env.SENTRY_DNS, {
    captureUnhandledRejections: true
}).install();

require("./mongoose");

import { FileController, RoomController } from "./controllers/";

let app = express();
const server = http.createServer(app);

var cwd = process.cwd();
var upload = multer({ dest: cwd + "/static_content/temporary_files" });

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

let socketio_options = {};
if (process.env.NODE_ENV === "development") {
    socketio_options = { "origins": "*:*" };
}
socketio(socketio_options);
const io = socketio.listen(server, {
    path: "/v2/socketio",
    serveClient: false,
});

io.on("connection", socket => {
    socket.on("joinRoom", (roomName) => {
        socket.join(roomName);
    });
});

const api = express.Router();

api.get("/", (req, res) => {
    res.json({
        ok: true
    });
})

api.get("/rooms/:name", RoomController.getRoom(io));
api.post("/rooms", RoomController.createRoom(io));

api.post("/files", upload.single("file"), FileController.addFile(io));
api.put("/files/:id", FileController.updateFile(io));
api.delete("/files/:id", FileController.deleteFile(io));

api.get("/_status", (req: Request, res: Response) => {
    res.status(200).json({ "ok": true });
});

app.use('/v2', api);

var port = process.env.PORT || 3000;

server.listen(port, (err: any) => {
    if (err) {
        console.error(err);
    } else {
        console.log("App is ready at : " + port);
    }
})