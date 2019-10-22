require('dotenv').config({ silent: true });
import * as Raven from "raven";
import { remove as removeFile } from "./helpers/s3";

Raven.config(process.env.SENTRY_DNS, {
    captureUnhandledRejections: true
}).install();

require("./mongoose");

import { RoomModel as Room, FileModel as File} from "./models";

async function deleteOldRooms() {
    const expiresRooms = await Room.find({
        expiresOn: {
            "$gte": new Date()
        }
    }).populate("file").limit(10);

    for (const expiresRoom of expiresRooms) {
        await Promise.all(expiresRoom.files.map(async (file) => {
            await removeFile(file.name).catch(err => console.error(err));
        }));

        File.deleteMany({id: { $in: expiresRoom.files.map(x => x.id)}});
        Room.deleteOne({ id: expiresRoom.id});
    }
}

(async () => {
    await deleteOldRooms();
})();
