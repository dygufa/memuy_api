import { Request, Response, NextFunction } from "express";
import { RoomModel as Room, WordModel as Word } from "../models/";

const _generateIneditRoomName = async (): Promise<string> => {
    const wordEntry = await Word.findOne({}).exec();
    if (!wordEntry) {
        throw new Error("Não existem palavras cadastradas.");
    }
    const word = wordEntry.word;
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
        const roomName = req.params.id;
        const room = await Room.findOne({ name: roomName });

        if (!room) {
            res.send({
                status: "fail", 
                error: {
                    name: "roomNotFound",
                    message: "Sala não encontrada"
                }
            });
        }

        res.json({
            status: "success", 
            data: room
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
            maxSpace: 100000000, // bytes = 100 Megabytes
            expiresOn: new Date(+new Date() + 24*60*60*1000) // will exprie in 24 hours
		});

        const room = await newRoom.save();
        
        res.json({
            status: "success",
            data: room
        });
	}
}