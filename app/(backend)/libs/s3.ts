import { S3Client, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { createSeoFilename } from "./utils";

const s3 = new S3Client({
  region: process.env.BUCKET_REGION,
  credentials: {
    accessKeyId: process.env.ACCESS_KEY!,
    secretAccessKey: process.env.SECRET_ACCESS_KEY!,
  },
});

export async function generateUploadUrl(
  fileName: string, 
  fileType: string, 
  folder: string = "global", 
  customName?: string
) {
 
  const seoFileName = createSeoFilename(fileName, customName);
  const key = `${folder}/${seoFileName}`;

  const command = new PutObjectCommand({
    Bucket: process.env.BUCKET_NAME,
    Key: key,
    ContentType: fileType,
  });

  const uploadUrl = await getSignedUrl(s3, command, { expiresIn: 60 });

  return { uploadUrl, key };
}

export async function deleteFromS3(key: string) {
  if (!key) return;

  const command = new DeleteObjectCommand({
    Bucket: process.env.BUCKET_NAME,
    Key: key,
  });

  try {
    await s3.send(command);
    console.log(`Deleted from S3: ${key}`);
  } catch (error) {
    console.error(`S3 Delete Error:`, error);
  }
}