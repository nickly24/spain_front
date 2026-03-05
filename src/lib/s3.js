import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";

const s3 = new S3Client({
  endpoint: process.env.S3_ENDPOINT,
  region: process.env.S3_REGION || "ru-1",
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY,
    secretAccessKey: process.env.S3_SECRET_KEY,
  },
  forcePathStyle: true,
});

const BUCKET = process.env.S3_BUCKET;

export async function uploadFile(buffer, key, contentType) {
  await s3.send(
    new PutObjectCommand({
      Bucket: BUCKET,
      Key: key,
      Body: buffer,
      ContentType: contentType,
      ACL: "public-read",
    }),
  );
  return getPublicUrl(key);
}

export async function deleteFile(url) {
  const key = keyFromUrl(url);
  if (!key) return;
  try {
    await s3.send(
      new DeleteObjectCommand({
        Bucket: BUCKET,
        Key: key,
      }),
    );
  } catch {
    // ignore — file may already be gone
  }
}

export function getPublicUrl(key) {
  const base = process.env.S3_PUBLIC_URL || process.env.S3_ENDPOINT;
  return `${base}/${BUCKET}/${key}`;
}

export function keyFromUrl(url) {
  if (!url) return null;
  const base = `${process.env.S3_PUBLIC_URL || process.env.S3_ENDPOINT}/${BUCKET}/`;
  if (url.startsWith(base)) return url.slice(base.length);
  if (url.startsWith("/")) return url.slice(1);
  return null;
}
