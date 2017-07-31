import { Request, Response, NextFunction } from "express";
import { RoomModel as Room } from "../models/";

export function getRoom(io: any) {
    return async function(req: Request, res: Response, next: NextFunction) {
        const roomName = req.params.id;
        const room = await Room.findOne({room: roomName});

        if (!room) {
            res.send({status: "fail", error: {
                code: 1,
                message: "Sala não encontrada"
            }});
        }

        res.json({status: "success", data: {
            room: room
        }});
	}
}

export function createRoom(io: any) {
    return async function(req: Request, res: Response, next: NextFunction) {
        const roomName = req.body.name;

        const room = await Room.findOne({room: roomName});

        if (room) {
            res.send({status: "fail", error: {
                code: 2,
                message: "Nome de sala já em uso"
            }});
            
            return false;
        }

        const newRoom = new Room({
			room: roomName,
            status: 1,
            usedSpace: 0,
            maxSpace: 100000000, // bytes = 100 Megabytes
            expiresOn: new Date(+new Date() + 24*60*60*1000) // will exprie in 24 hours
		});

		await newRoom.save();
	}
}