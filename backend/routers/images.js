import { Router } from "express";
import { PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { s3, randomImageName, bucketName } from "../storage/S3Config.js";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import multer from "multer";
import { addFileData, getFileData } from "../database/index.js";
import { db, getAllDocs } from "../database/firebaseConfig.js";

export const nodeApi = Router();

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

nodeApi.post("/upload", upload.single("image"), async (req, res) => {
  const encryptedFileName = randomImageName();

  const params = {
    Bucket: bucketName,
    Key: encryptedFileName,
    Body: req.file.buffer,
    ContentType: req.file.mimetype,
  };
  console.log("🚀 ~ file: images.js:23 ~ nodeApi.post ~ params:", params);

  const imageData = {
    fieldname: req.file.fieldname,
    fileName: req.file.originalname,
    encryptedFileName: encryptedFileName,
    contentType: req.file.mimetype,
    caption: req.body.caption,
    timeStamp: new Date().toLocaleString(undefined, {
      timeZone: "Asia/Kolkata",
    }),
  };

  try {
    const command = new PutObjectCommand(params);
    await s3.send(command);
    console.log("Image uploaded in S3");

    await addFileData(imageData);
    // await getAllDocs();

    console.log("🚀 ~ Image data updated");
    res.status(200).send({ message: "Image uploaded" });
  } catch (err) {
    console.log("🚀 ~ file: images.js:45 ~ nodeApi.post ~ err:", err);
    res.status(500).send(err);
  }
});

nodeApi.get("/fetch", async (req, res) => {
  getFileData()
    .then(async (element) => {
      const posts = JSON.parse(element);
      const data = posts.data;
      console.log("🚀 ~ file: images.js:55 ~ .then ~ posts:", data);

      const newData = [];
      for (let post of data) {
        const getObjectParams = {
          Bucket: bucketName,
          Key: post.encryptedFileName,
        };

        const command = new GetObjectCommand(getObjectParams);
        const url = await getSignedUrl(s3, command, { expiresIn: 3600 });
        let newPost = {
          ...post,
          imageUrl: url,
        };
        newData.push(newPost);
      }

      console.log("🚀 ~ file: images.js:58 ~ .then ~ data:", newData);
      res.status(200).send(newData);
    })
    .catch((err) => {
      console.log("🚀 ~ file: images.js:60 ~ nodeApi.get ~ err:", err);
      res.status(500).send(err)
    });
});
