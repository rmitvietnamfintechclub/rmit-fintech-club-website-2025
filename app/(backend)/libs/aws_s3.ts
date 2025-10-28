import { S3Client, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";

const s3 = new S3Client({
  region: process.env.NEXT_PUBLIC_BUCKET_REGION || "ap-southeast-2",
  credentials: {
    accessKeyId: process.env.ACCESS_KEY!,
    secretAccessKey: process.env.SECRET_ACCESS_KEY!,
  },
});
// upload file to s3 and return cloudfront url for uploaded file 
export async function uploadToS3(file: Buffer, fileName: string): Promise<string> {
  const key = `projects/${Date.now()}-${fileName}`;
  await s3.send(new PutObjectCommand({
    Bucket: process.env.NEXT_PUBLIC_BUCKET_NAME!,
    Key: key,
    Body: file,
    ACL: "public-read",
  }));
  return `https://${process.env.CLOUDFRONT_DOMAIN}/${key}`;
}

// delete files from aws s3 
export async function deleteFromS3(fileUrl: string): Promise<void> {
  if (!fileUrl.includes(process.env.CLOUDFRONT_DOMAIN!)) return;
  
  const key = fileUrl.replace(`https://${process.env.CLOUDFRONT_DOMAIN}/`, "");
  await s3.send(new DeleteObjectCommand({
    Bucket: process.env.NEXT_PUBLIC_BUCKET_NAME!,
    Key: key,
  }));
} 