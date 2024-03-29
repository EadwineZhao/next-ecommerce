import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import multiparty from "multiparty";
import fs from "fs";
import mime from "mime-types"
import { mongooseConnect } from "@/lib/mongoose";
import { isAdminRequest } from "./auth/[...nextauth]";

export default async function handle (req, res) {
    await mongooseConnect();
    await isAdminRequest(req, res);
    const bucketName = "redwin-next-ecommerce";
    const form = new multiparty.Form();

    // form.parse(req, (err, fields, files) => {
    //     console.log("files",files, "fields",fields);
    //     res.json("ok")
    // });

    const { fields, files } = await new Promise(( resolve, reject) => {
        form.parse(req, (err, fields, files) => {
            if(err) reject(err);
            resolve ({ files, fields})
        })
    })    

    const client = new S3Client({
        region: 'ap-southeast-2',
        credentials: {
            accessKeyId: process.env.S3_ACCESS_KEY,
            secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
        },
    });

    const links = [];
    for(const file of files.file) {
        const ext = file.originalFilename.split('.').pop();
        const newFilename = Date.now() + "." + ext;
        await client.send(new PutObjectCommand({
            Bucket: bucketName,
            Key: newFilename,
            Body: fs.readFileSync(file.path),
            ACL: "public-read",
            ContentType: mime.lookup(file.path)
        }))
        const link = `https://${bucketName}.s3.amazonaws.com/${newFilename}`;
        links.push(link);
    }

    res.json({ links });
}

export const config = {
    api: {
        bodyParser: false
    }
}