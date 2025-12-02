import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { z } from "zod";

const R2_ACCOUNT_ID = process.env.R2_ACCOUNT_ID;
const R2_ACCESS_KEY_ID = process.env.R2_ACCESS_KEY_ID;
const R2_SECRET_ACCESS_KEY = process.env.R2_SECRET_ACCESS_KEY;
const R2_BUCKET_NAME = process.env.R2_BUCKET_NAME;
const NEXT_PUBLIC_IMAGE_DOMAIN = process.env.NEXT_PUBLIC_IMAGE_DOMAIN;

const s3Client = new S3Client({
  region: "auto",
  endpoint: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: R2_ACCESS_KEY_ID || "",
    secretAccessKey: R2_SECRET_ACCESS_KEY || "",
  },
});

const uploadSchema = z.object({
  filename: z.string(),
  contentType: z.string(),
  size: z.number().max(100 * 1024 * 1024), // Max 100MB
  type: z.enum(["avatar", "novel", "chapter", "general"]).default("general"),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { filename, contentType, type } = uploadSchema.parse(body);

    const fileExtension = filename.split(".").pop();
    const uniqueFilename = `${uuidv4()}.${fileExtension}`;
    const key = `${type}/${uniqueFilename}`;

    const command = new PutObjectCommand({
      Bucket: R2_BUCKET_NAME,
      Key: key,
      MediaType: contentType,
    });

    const url = await getSignedUrl(s3Client, command, { expiresIn: 3600 });

    return NextResponse.json({
      url,
      key,
      publicUrl: `${NEXT_PUBLIC_IMAGE_DOMAIN}/${key}`,
    });
  } catch (error) {
    console.error("Error generating presigned URL:", error);
    return NextResponse.json(
      { error: "Failed to generate upload URL" },
      { status: 500 }
    );
  }
}
