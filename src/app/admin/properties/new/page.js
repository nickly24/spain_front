import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "../../../../lib/prisma";
import { uploadFile } from "../../../../lib/s3";
import { CreatePropertyForm } from "@/components/admin/CreatePropertyForm";

async function createProperty(formData) {
  "use server";

  const title = formData.get("title")?.toString() || "";
  let slug = (formData.get("slug")?.toString() || "").trim();
  const cityId = Number(formData.get("cityId") || 0) || null;

  function slugify(s) {
    return String(s)
      .trim()
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "")
      .slice(0, 100) || "obekt";
  }

  if (!slug) slug = slugify(title);

  let uniqueSlug = slug;
  let suffix = 1;
  while (await prisma.property.findUnique({ where: { slug: uniqueSlug } })) {
    uniqueSlug = `${slug}-${suffix++}`;
  }
  slug = uniqueSlug;
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

  let cityLabelRu = "";
  if (cityId) {
    const cityRow = await prisma.city.findUnique({
      where: { id: cityId },
      include: { translations: true },
    });
    if (cityRow?.translations) {
      cityLabelRu =
        cityRow.translations.find((t) => t.locale === "ru")?.label ||
        cityRow.translations[0]?.label ||
        "";
    }
  }

  const created = await prisma.property.create({
    data: {
      title,
      slug,
      city: cityLabelRu,
      cityId,
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

  const files = formData.getAll("images").filter((file) => file && typeof file !== "string");
  if (files.length) {
    let sortOrder = 1;
    for (let index = 0; index < files.length; index++) {
      const file = files[index];
      if (!file || typeof file === "string") continue;

      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const originalName = (file.name || "image").toString();
      const ext = originalName.split(".").pop()?.toLowerCase() || "jpg";
      const base = originalName
        .replace(/\.[^.]+$/, "")
        .replace(/[^a-zA-Z0-9_-]/g, "_")
        .toLowerCase();
      const key = `uploads/${base}_${Date.now()}_${index}.${ext}`;

      const publicUrl = await uploadFile(buffer, key, file.type || "image/jpeg");

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

  revalidatePath("/", "layout");
  redirect(`/admin/properties/${created.id}`);
}

export default async function AdminPropertyCreatePage() {
  const cities = await prisma.city.findMany({
    where: { visible: true },
    orderBy: [{ sortOrder: "asc" }, { id: "asc" }],
    include: { translations: true },
  });

  const cityOptions = cities.map((c) => {
    const ru =
      c.translations.find((t) => t.locale === "ru")?.label ||
      c.translations[0]?.label ||
      c.key;
    return { id: c.id, label: ru };
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Новый объект</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Создание объекта для продажи или аренды. После сохранения можно будет донастроить
          остальные поля.
        </p>
      </div>

      <CreatePropertyForm createProperty={createProperty} cities={cityOptions} />
    </div>
  );
}
