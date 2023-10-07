import express from "express";
import { config } from "dotenv";
import multer from "multer";
import cors from "cors";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import crypto from "crypto";

const app = express();
app.use(cors());
config();

const bucketName = process.env.S3_BUCKET_NAME;
const bucketLocation = process.env.S3_BUCKET_LOCATION;
const bucketAccessKey = process.env.S3_BUCKET_ACCESS_KEY;
const bucketSecretAccessKey = process.env.S3_BUCKET_SECRET_ACCESS_KEY;

const s3 = new S3Client({
  credentials: {
    accessKeyId: bucketAccessKey,
    secretAccessKey: bucketSecretAccessKey,
  },
  region: bucketLocation,
});

const randomImageName = (byte = 32) => crypto.randomBytes(byte).toString("hex");

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.post("/api/post", upload.single("image"), async (req, res) => {
  console.log("🚀 ~ file: index.js:14 ~ app.post ~ api/post", req.body);
  console.log("🚀 ~ file: index.js:15 ~ app.post ~ api/post", req.file);

  const params = {
    Bucket: bucketName,
    Key: randomImageName(),
    Body: req.file.buffer,
    ContentType: req.file.mimetype,
  };

  const command = new PutObjectCommand(params);
  await s3.send(command);

  res.send({});
});

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`App is running in http://localhost:${PORT}`);
});
