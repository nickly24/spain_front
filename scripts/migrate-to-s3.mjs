import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { PrismaClient } from "@prisma/client";
import { promises as fs } from "fs";
import path from "path";

const S3_ENDPOINT = "https://s3.twcstorage.ru";
const S3_REGION = "ru-1";
const S3_BUCKET = "0190249e-fd83-448e-a363-9376091094ba";
const S3_ACCESS_KEY = "0BT5NDPS1F6U9HAUQV61";
const S3_SECRET_KEY = "aO1XocT2d2zgSwhzYPkDMxsVfbClKU5CwvRatyCH";

const s3 = new S3Client({
  endpoint: S3_ENDPOINT,
  region: S3_REGION,
  credentials: { accessKeyId: S3_ACCESS_KEY, secretAccessKey: S3_SECRET_KEY },
  forcePathStyle: true,
});

const prisma = new PrismaClient();
const PREFIX = `${S3_ENDPOINT}/${S3_BUCKET}`;

function guessMime(ext) {
  const map = { ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".png": "image/png", ".gif": "image/gif", ".webp": "image/webp", ".svg": "image/svg+xml" };
  return map[ext.toLowerCase()] || "application/octet-stream";
}

async function getAllFiles(dir) {
  const results = [];
  let entries;
  try { entries = await fs.readdir(dir, { withFileTypes: true }); } catch { return results; }
  for (const e of entries) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) results.push(...(await getAllFiles(full)));
    else if (!e.name.startsWith(".")) results.push(full);
  }
  return results;
}

async function uploadDir(dirName) {
  const dirPath = path.join(process.cwd(), "public", dirName);
  const files = await getAllFiles(dirPath);
  console.log(`\n  ${dirName}/: ${files.length} files`);

  let ok = 0, fail = 0;
  for (const filePath of files) {
    const key = path.relative(path.join(process.cwd(), "public"), filePath).replace(/\\/g, "/");
    try {
      const buffer = await fs.readFile(filePath);
      await s3.send(new PutObjectCommand({
        Bucket: S3_BUCKET, Key: key, Body: buffer,
        ContentType: guessMime(path.extname(filePath)),
        ACL: "public-read",
      }));
      ok++;
      console.log(`    OK  ${key}`);
    } catch (err) {
      fail++;
      console.error(`    FAIL ${key}: ${err.message}`);
    }
  }
  return { ok, fail };
}

async function main() {
  console.log("=== Step 1: Upload local files to S3 ===");

  const r1 = await uploadDir("photos");
  const r2 = await uploadDir("uploads");

  const totalOk = r1.ok + r2.ok;
  const totalFail = r1.fail + r2.fail;
  console.log(`\n  Total uploaded: ${totalOk}, failed: ${totalFail}\n`);

  console.log("=== Step 2: Update DB URLs ===\n");

  // PropertyImage: /photos/... -> S3 URL
  const imgs = await prisma.propertyImage.findMany({ where: { url: { startsWith: "/" } } });
  let updated = 0;
  for (const r of imgs) {
    if (r.url.startsWith("http")) continue;
    const newUrl = `${PREFIX}${r.url}`;
    await prisma.propertyImage.update({ where: { id: r.id }, data: { url: newUrl } });
    console.log(`  PropertyImage #${r.id}: ${r.url} -> ...${r.url}`);
    updated++;
  }

  // Partner: /uploads/... -> S3 URL (skip already S3)
  const partners = await prisma.partner.findMany();
  for (const r of partners) {
    if (!r.logoUrl || r.logoUrl.startsWith("http")) continue;
    const newUrl = `${PREFIX}${r.logoUrl}`;
    await prisma.partner.update({ where: { id: r.id }, data: { logoUrl: newUrl } });
    console.log(`  Partner #${r.id}: ${r.logoUrl}`);
    updated++;
  }

  // ConstructionCase
  const cases = await prisma.constructionCase.findMany();
  for (const r of cases) {
    const data = {};
    if (r.beforeUrl && !r.beforeUrl.startsWith("http")) {
      data.beforeUrl = `${PREFIX}${r.beforeUrl}`;
    }
    if (r.afterUrl && !r.afterUrl.startsWith("http")) {
      data.afterUrl = `${PREFIX}${r.afterUrl}`;
    }
    if (Object.keys(data).length) {
      await prisma.constructionCase.update({ where: { id: r.id }, data });
      console.log(`  Case #${r.id}: updated`);
      updated++;
    }
  }

  // HeroBanner
  const banners = await prisma.heroBanner.findMany();
  for (const r of banners) {
    if (!r.imageUrl || r.imageUrl.startsWith("http")) continue;
    const newUrl = `${PREFIX}${r.imageUrl}`;
    await prisma.heroBanner.update({ where: { id: r.id }, data: { imageUrl: newUrl } });
    console.log(`  HeroBanner #${r.id}: ${r.imageUrl}`);
    updated++;
  }

  console.log(`\n  Total DB records updated: ${updated}`);
  console.log("\n=== Migration complete ===");
  await prisma.$disconnect();
}

main().catch((e) => { console.error(e); process.exit(1); });
