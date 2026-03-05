import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "../../../lib/prisma";
import { uploadFile } from "../../../lib/s3";

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

  const ext = (file.name || "").split(".").pop()?.toLowerCase() || "jpg";
  const base = (file.name || "image").replace(/\.[^.]+$/, "").replace(/[^a-z0-9_-]/gi, "_");
  const timestamp = Date.now();
  const key = `uploads/${base}_${timestamp}.${ext}`;

  const publicUrl = await uploadFile(buffer, key, file.type || "image/jpeg");

  if (kind === "hero" && pageSlug) {
    const existing = await prisma.heroBanner.findFirst({ where: { pageSlug } });
    if (existing) {
      await prisma.heroBanner.update({
        where: { id: existing.id },
        data: { imageUrl: publicUrl },
      });
    } else {
      await prisma.heroBanner.create({
        data: { pageSlug, imageUrl: publicUrl },
      });
    }
  }

  return NextResponse.json({ url: publicUrl });
}
