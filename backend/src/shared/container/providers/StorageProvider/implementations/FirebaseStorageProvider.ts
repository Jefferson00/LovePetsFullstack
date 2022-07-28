import IStorageProvider from "../models/IStorageProvider";
import fs from "fs";
import path from "path";
import mime from "mime";
import uploadConfig from "@config/upload";
const { Storage } = require("@google-cloud/storage");

const keyFile = path.resolve(
  __dirname,
  "..",
  "..",
  "..",
  "..",
  "..",
  "..",
  "love-pets-beta-firebase-adminsdk-zynpr-2d03252ffb.json"
);

export default class FirebaseStorageProvider implements IStorageProvider {
  private storage;
  private bucketName: string;

  constructor() {
    this.storage = new Storage({
      keyFilename: keyFile,
    });
    this.bucketName = process.env.FIREBASE_BUCKET_NAME;
  }

  public async saveFile(file: string): Promise<string> {
    const originalPath = path.resolve(uploadConfig.tmpFolder, file);

    const ContentType = mime.getType(originalPath);

    if (!ContentType) {
      throw new Error("File not found.");
    }

    await this.storage.bucket(this.bucketName).upload(originalPath, {
      gzip: true,
      metadata: {
        cacheControl: "public, max-age=31536000",
      },
    });

    if (fs.existsSync(originalPath)) {
      await fs.promises.unlink(originalPath);
    }

    return file;
  }

  public async deleteFile(file: string): Promise<void> {
    await this.storage.bucket(this.bucketName).file(file).delete();
  }
}
