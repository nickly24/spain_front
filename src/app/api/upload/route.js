import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { promises as fs } from "fs";
import path from "path";
import { prisma } from "../../../lib/prisma";

export const dynamic = "force-dynamic";

export async function POST(req) {
  const cookieStore = await cookies();
  const isAuthed = cookieStore.get("mg_admin_auth")?.value === "1";
  if (!isAuthed) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const contentType = req.headers.get("content-type") || "";
  if (!contentType.startsWith("multipart/form-data")) {
    return NextResponse.json({ error: "Invalid content type" }, { status: 400 });
  }

  const formData = await req.formData();
  const file = formData.get("file");
  const kind = formData.get("kind")?.toString() || "generic";
  const pageSlug = formData.get("pageSlug")?.toString() || null;

  if (!file || typeof file === "string") {
    return NextResponse.json({ error: "No file" }, { status: 400 });
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const uploadsDir = path.join(process.cwd(), "public", "uploads");
  await fs.mkdir(uploadsDir, { recursive: true });

  const ext = path.extname(file.name || "").toLowerCase() || ".jpg";
  const base = path.basename(file.name || "image", ext).replace(/[^a-z0-9_-]/gi, "_");
  const timestamp = Date.now();
  const filename = `${base}_${timestamp}${ext}`;
  const filePath = path.join(uploadsDir, filename);
  const publicPath = `/uploads/${filename}`;

  await fs.writeFile(filePath, buffer);

  if (kind === "hero" && pageSlug) {
    await prisma.heroBanner.upsert({
      where: { pageSlug },
      update: { imageUrl: publicPath },
      create: { pageSlug, imageUrl: publicPath },
    });
  }

  return NextResponse.json({ url: publicPath });
}

