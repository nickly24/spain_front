import { redirect } from "next/navigation";
import path from "path";
import { promises as fs } from "fs";
import { prisma } from "../../../../lib/prisma";
import { CreatePropertyForm } from "@/components/admin/CreatePropertyForm";

async function createProperty(formData) {
  "use server";

  const title = formData.get("title")?.toString() || "";
  const slug = formData.get("slug")?.toString() || "";
  const city = formData.get("city")?.toString() || "";
  const listingType = formData.get("listingType")?.toString() === "rent" ? "rent" : "sale";
  const bedrooms = Number(formData.get("bedrooms") || 0);
  const areaM2 = Number(formData.get("areaM2") || 0);
  const priceEur =
    listingType === "sale" ? Number(formData.get("priceEur") || 0) || null : null;
  const rentEurPerMonth =
    listingType === "rent" ? Number(formData.get("rentEurPerMonth") || 0) || null : null;
  const description = formData.get("description")?.toString() || "";
  const status = formData.get("status")?.toString() || "draft";
  const views = Number(formData.get("views") || 0);
  const rating = Number(formData.get("rating") || 0);

  const created = await prisma.property.create({
    data: {
      title,
      slug,
      city,
      listingType,
      bedrooms,
      areaM2,
      priceEur,
      rentEurPerMonth,
      description,
      status,
      views,
      rating,
    },
  });

  // Загрузка фотографий — CreatePropertyForm передаёт files в порядке (главное первое)
  const files = formData.getAll("images").filter((file) => file && typeof file !== "string");
  if (files.length) {
    const uploadsDir = path.join(process.cwd(), "public", "uploads");
    await fs.mkdir(uploadsDir, { recursive: true });

    let sortOrder = 1;
    for (let index = 0; index < files.length; index++) {
      const file = files[index];
      if (!file || typeof file === "string") continue;

      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const originalName = (file.name || "image").toString();
      const ext = path.extname(originalName) || ".jpg";
      const base = path
        .basename(originalName, ext)
        .replace(/[^a-zA-Z0-9_-]/g, "_")
        .toLowerCase();
      const filename = `${base}_${Date.now()}_${index}${ext}`;
      const filePath = path.join(uploadsDir, filename);
      const publicUrl = `/uploads/${filename}`;

      await fs.writeFile(filePath, buffer);

      await prisma.propertyImage.create({
        data: {
          propertyId: created.id,
          url: publicUrl,
          alt: title || originalName,
          sortOrder: sortOrder++,
          isMain: index === 0,
        },
      });
    }
  }

  redirect(`/admin/properties/${created.id}`);
}

export default function AdminPropertyCreatePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Новый объект</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Создание объекта для продажи или аренды. После сохранения можно будет донастроить
          остальные поля.
        </p>
      </div>

      <CreatePropertyForm createProperty={createProperty} />
    </div>
  );
}
