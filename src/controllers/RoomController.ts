import { Request, Response, NextFunction } from "express";
import { RoomModel as Room, WordModel as Word } from "../models/";
import { IRoomModel } from "../models/RoomModel";
import { only } from "sanitize-object";
import { _sanitizeFile } from "./FileController";

export const _sanitizeRoom = (room: IRoomModel) => {
    const sanitizer = only("name", "status", "usedSpace", "maxSpace", "files", "createdAt", "expiresOn");
    const sanitizedRoom = sanitizer(room);
    sanitizedRoom.files = sanitizedRoom.files.map(_sanitizeFile);
    return sanitizedRoom;
}


const _generateIneditRoomName = async (): Promise<string> => {
    let wordEntry = await Word.findOne({}).exec();
    // Se não existem palavras cadastrasdas, cadastra duas palavras básicas
    if (!wordEntry) {
        const basicWord = new Word({
            word: "hi",
            language: "eng"
        });
        await basicWord.save();
        let wordEntry = basicWord;
    }
    const word = wordEntry!.word;
    const code = Math.floor(Math.random() * 9000) + 1000;
    const roomName = word + code;
    
    // Se já existir uma sala com o nome gerado: tenta outro nome
    const room = await Room.findOne({ name: roomName }).exec();
    if (room) {
        return await _generateIneditRoomName();
    } else {
        return roomName;
    }
}

export const getRoom = (io: SocketIO.Server) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        const roomName = req.params.name;
        const room = await Room.findOne({ name: roomName });

        if (!room) {
            return res.status(404).send({
                status: "fail", 
                error: {
                    name: "roomNotFound",
                    message: "Sala não encontrada"
                }
            });
        }

        res.json({
            status: "success", 
            data: _sanitizeRoom(room!.toObject() as IRoomModel)
        });
	}
}

export const createRoom = (io: SocketIO.Server) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        const roomName = await _generateIneditRoomName();

        const newRoom = new Room({
			name: roomName,
            status: "available",
            usedSpace: 0,
            maxSpace: 100 * 1024 * 1024, // bytes = 100 Megabytes
            expiresOn: new Date(+new Date() + 24*60*60*1000) // will exprie in 24 hours
		});

        const room = await newRoom.save();

        res.json({
            status: "success",
            data: _sanitizeRoom(room!.toObject() as IRoomModel)
        });
	}
}