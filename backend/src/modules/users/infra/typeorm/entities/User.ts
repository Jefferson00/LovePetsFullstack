import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";

import { Exclude, Expose } from "class-transformer";

import uploadConfig from "@config/upload";

@Entity("users")
class User {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  @Exclude()
  password: string;

  @Column()
  avatar: string;

  @Column()
  phone: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @Expose({ name: "avatar_url" })
  getAvatarUrl(): string | null {
    if (!this.avatar) {
      return null;
    }
    switch (uploadConfig.driver) {
      case "disk":
        return this.avatar.startsWith("http")
          ? this.avatar
          : `${process.env.APP_API_URL}/files/${this.avatar}`;
      case "s3":
        return `https://${uploadConfig.config.aws.bucket}.s3.amazonaws.com/${this.avatar}`;
      case "firebase":
        return `https://firebasestorage.googleapis.com/v0/b/${process.env.FIREBASE_BUCKET_NAME}/o/${this.avatar}?alt=media&token=${process.env.FIREBASE_IMAGE_TOKEN}`;
      default:
        return null;
    }
  }
}

export default User;
