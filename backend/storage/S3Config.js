import { S3Client } from "@aws-sdk/client-s3";
import crypto from "crypto";
import { config } from "dotenv";
config();

export const bucketName = process.env.S3_BUCKET_NAME;
const bucketLocation = process.env.S3_BUCKET_LOCATION;
const bucketAccessKey = process.env.S3_BUCKET_ACCESS_KEY;
const bucketSecretAccessKey = process.env.S3_BUCKET_SECRET_ACCESS_KEY;

export const s3 = new S3Client({
  credentials: {
    accessKeyId: bucketAccessKey,
    secretAccessKey: bucketSecretAccessKey,
  },
  region: bucketLocation,
});

export const randomImageName = (byte = 32) =>
  crypto.randomBytes(byte).toString("hex");
