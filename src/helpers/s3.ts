import * as aws from "aws-sdk";
import * as slug from "slug";
import * as mime from "mime-types";
import * as fs from "fs";
import { ManagedUpload } from "aws-sdk/clients/s3";

const S3_BUCKET = process.env.S3_BUCKET;
const s3 = new aws.S3();

function fileExtension(file: Express.Multer.File) {
    let extension = mime.extension(file.mimetype);

    if (!extension) {
        const re = /(?:\.([^.]+))?$/;
        extension = re.exec(file.originalname)![1];
    }

    return extension;
}

export async function upload(file: Express.Multer.File) {
    if (!S3_BUCKET) {
        throw new Error("S3_BUCKET is not defined");
    }

    const filename = slug(file.originalname.replace(/\.[^/.]+$/, ""));
    const extension = fileExtension(file);

    const newFilename = Date.now().toString() + "-" + filename + "." + extension;

    const fileStream = fs.createReadStream(file.path);

    return <Promise<ManagedUpload.SendData>>new Promise((resolve, reject) => {
        s3.upload({
            Bucket: S3_BUCKET,
            Key: newFilename,
            ContentType: file.mimetype,
            ACL: "public-read",
            Body: fileStream,
        }).send((err, data) => {
            if (err) {
                return reject(err);
            }
            return resolve(data);
        });
    });
}
