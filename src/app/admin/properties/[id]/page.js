import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import path from "path";
import { promises as fs } from "fs";
import { prisma } from "../../../../lib/prisma";
import { pickTranslatedLabel } from "../../../../lib/tags";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export const dynamic = "force-dynamic";

async function updateProperty(formData) {
  "use server";

  const id = Number(formData.get("id"));
  if (!id) return;

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
  const status = formData.get("status")?.toString() || "draft";
  const description = formData.get("description")?.toString() || "";
  const views = Number(formData.get("views") || 0);
  const rating = Number(formData.get("rating") || 0);

  const trTitleEn = formData.get("tr_title_en")?.toString() || "";
  const trDescEn = formData.get("tr_description_en")?.toString() || "";
  const trSeoTitleEn = formData.get("tr_seoTitle_en")?.toString() || "";
  const trSeoDescEn = formData.get("tr_seoDescription_en")?.toString() || "";

  const trTitleEs = formData.get("tr_title_es")?.toString() || "";
  const trDescEs = formData.get("tr_description_es")?.toString() || "";
  const trSeoTitleEs = formData.get("tr_seoTitle_es")?.toString() || "";
  const trSeoDescEs = formData.get("tr_seoDescription_es")?.toString() || "";

  const section = listingType === "rent" ? "rent" : "sale";
  const tagIds = formData
    .getAll("tagIds")
    .map((v) => Number(v))
    .filter((n) => Number.isFinite(n) && n > 0);

  await prisma.$transaction(async (tx) => {
    await tx.property.update({
      where: { id },
      data: {
        title,
        slug,
        city,
        listingType,
        bedrooms,
        areaM2,
        priceEur,
        rentEurPerMonth,
        status,
        description,
        views,
        rating,
      },
    });

    // Сохраняем только теги, которые относятся к текущему разделу (sale/rent).
    const allowed = tagIds.length
      ? await tx.tag.findMany({
          where: { id: { in: tagIds }, section },
          select: { id: true },
        })
      : [];
    const allowedIds = allowed.map((t) => t.id);

    await tx.propertyTag.deleteMany({ where: { propertyId: id } });
    if (allowedIds.length) {
      await tx.propertyTag.createMany({
        data: allowedIds.map((tagId) => ({ propertyId: id, tagId })),
        skipDuplicates: true,
      });
    }

    async function upsertTr(locale, data) {
      const hasAny =
        (data.title || "").trim() ||
        (data.description || "").trim() ||
        (data.seoTitle || "").trim() ||
        (data.seoDescription || "").trim();
      if (!hasAny) {
        await tx.propertyTranslation.deleteMany({ where: { propertyId: id, locale } });
        return;
      }
      const safeTitle = (data.title || "").trim() || title;
      const safeDesc = (data.description || "").trim() || description;
      await tx.propertyTranslation.upsert({
        where: { propertyId_locale: { propertyId: id, locale } },
        update: {
          title: safeTitle,
          description: safeDesc,
          seoTitle: (data.seoTitle || "").trim() || null,
          seoDescription: (data.seoDescription || "").trim() || null,
        },
        create: {
          propertyId: id,
          locale,
          title: safeTitle,
          description: safeDesc,
          seoTitle: (data.seoTitle || "").trim() || null,
          seoDescription: (data.seoDescription || "").trim() || null,
        },
      });
    }

    await upsertTr("en", {
      title: trTitleEn,
      description: trDescEn,
      seoTitle: trSeoTitleEn,
      seoDescription: trSeoDescEn,
    });
    await upsertTr("es", {
      title: trTitleEs,
      description: trDescEs,
      seoTitle: trSeoTitleEs,
      seoDescription: trSeoDescEs,
    });
  });

  redirect(`/admin/properties/${id}`);
}

async function deleteProperty(formData) {
  "use server";

  const id = Number(formData.get("id"));
  if (!id) return;

  await prisma.propertyImage.deleteMany({ where: { propertyId: id } });
  await prisma.property.delete({ where: { id } });

  redirect("/admin/properties");
}

async function addImage(formData) {
  "use server";

  const propertyId = Number(formData.get("propertyId"));
  if (!propertyId) return;

  const file = formData.get("file");
  const alt = formData.get("alt")?.toString() || "";

  if (!file || typeof file === "string") {
    redirect(`/admin/properties/${propertyId}`);
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const uploadsDir = path.join(process.cwd(), "public", "uploads");
  await fs.mkdir(uploadsDir, { recursive: true });

  const originalName = (file.name || "image").toString();
  const ext = path.extname(originalName) || ".jpg";
  const base = path
    .basename(originalName, ext)
    .replace(/[^a-zA-Z0-9_-]/g, "_")
    .toLowerCase();
  const filename = `${base}_${Date.now()}${ext}`;
  const filePath = path.join(uploadsDir, filename);
  const publicUrl = `/uploads/${filename}`;

  await fs.writeFile(filePath, buffer);

  const maxOrder = await prisma.propertyImage.aggregate({
    _max: { sortOrder: true },
    where: { propertyId },
  });
  const nextOrder = (maxOrder._max.sortOrder ?? 0) + 1;

  const hasMain = await prisma.propertyImage.findFirst({
    where: { propertyId, isMain: true },
  });

  await prisma.propertyImage.create({
    data: {
      propertyId,
      url: publicUrl,
      alt,
      sortOrder: nextOrder,
      isMain: !hasMain,
    },
  });

  redirect(`/admin/properties/${propertyId}`);
}

async function setMainImage(formData) {
  "use server";

  const propertyId = Number(formData.get("propertyId"));
  const imageId = Number(formData.get("imageId"));
  if (!propertyId || !imageId) return;

  await prisma.propertyImage.updateMany({
    where: { propertyId },
    data: { isMain: false },
  });

  await prisma.propertyImage.update({
    where: { id: imageId },
    data: { isMain: true },
  });

  redirect(`/admin/properties/${propertyId}`);
}

async function deleteImage(formData) {
  "use server";

  const propertyId = Number(formData.get("propertyId"));
  const imageId = Number(formData.get("imageId"));
  if (!propertyId || !imageId) return;

  const image = await prisma.propertyImage.findUnique({ where: { id: imageId } });
  if (image?.url) {
    const uploadsDir = path.join(process.cwd(), "public");
    const abs = path.join(uploadsDir, image.url.replace(/^\/+/, ""));
    try {
      await fs.unlink(abs);
    } catch {
      // ignore if file missing
    }
  }

  await prisma.propertyImage.delete({ where: { id: imageId } });

  redirect(`/admin/properties/${propertyId}`);
}

export default async function AdminPropertyEditPage({ params }) {
  const resolvedParams = await Promise.resolve(params);
  const id = Number(resolvedParams?.id);
  if (!id) return notFound();

  const property = await prisma.property.findUnique({
    where: { id },
    include: {
      images: {
        orderBy: [{ isMain: "desc" }, { sortOrder: "asc" }],
      },
      tags: {
        select: { tagId: true },
      },
      translations: true,
    },
  });
  if (!property) return notFound();

  const isSale = property.listingType === "sale";
  const section = isSale ? "sale" : "rent";
  const availableTags = await prisma.tag.findMany({
    where: { section },
    orderBy: [{ visible: "desc" }, { sortOrder: "asc" }, { id: "asc" }],
    include: { translations: true, _count: { select: { properties: true } } },
  });
  const selectedTagIds = new Set((property.tags || []).map((t) => t.tagId));
  const trByLocale = new Map((property.translations || []).map((t) => [t.locale, t]));
  const trEn = trByLocale.get("en") || null;
  const trEs = trByLocale.get("es") || null;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Объект #{property.id}</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Редактирование базовой информации об объекте. Галерея и баннеры
            будут вынесены в отдельный раздел.
          </p>
        </div>
      </div>

      <form action={updateProperty} className="space-y-6">
        <input type="hidden" name="id" defaultValue={property.id} />

        <Card>
          <CardHeader>
            <CardTitle>Базовая информация</CardTitle>
            <CardDescription>Поля и статус объекта на сайте.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Заголовок</Label>
                  <Input name="title" defaultValue={property.title} />
                </div>
                <div className="space-y-2">
                  <Label>Slug (URL)</Label>
                  <Input name="slug" defaultValue={property.slug} />
                </div>
                <div className="space-y-2">
                  <Label>Город</Label>
                  <Input name="city" defaultValue={property.city} />
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <div className="space-y-2">
                    <Label>Формат</Label>
                    <select
                      name="listingType"
                      defaultValue={property.listingType}
                      className="h-10 w-full rounded-xl border border-input bg-background px-3 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                      <option value="sale">Продажа</option>
                      <option value="rent">Аренда</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label>Спальни</Label>
                    <Input name="bedrooms" type="number" defaultValue={property.bedrooms} />
                  </div>
                  <div className="space-y-2">
                    <Label>Площадь, м²</Label>
                    <Input name="areaM2" type="number" defaultValue={property.areaM2} />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Цена, €</Label>
                    <Input name="priceEur" type="number" defaultValue={property.priceEur ?? ""} />
                  </div>
                  <div className="space-y-2">
                    <Label>Аренда, €/мес</Label>
                    <Input
                      name="rentEurPerMonth"
                      type="number"
                      defaultValue={property.rentEurPerMonth ?? ""}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Просмотры</Label>
                    <Input name="views" type="number" defaultValue={property.views ?? 0} />
                  </div>
                  <div className="space-y-2">
                    <Label>Рейтинг</Label>
                    <Input
                      name="rating"
                      type="number"
                      step="0.1"
                      min="0"
                      max="5"
                      defaultValue={property.rating ?? 0}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Статус</Label>
                  <select
                    name="status"
                    defaultValue={property.status}
                    className="h-10 w-full rounded-xl border border-input bg-background px-3 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <option value="draft">Черновик</option>
                    <option value="published">Опубликован</option>
                    <option value="archived">Архив</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label>Описание</Label>
                  <Textarea name="description" defaultValue={property.description || ""} rows={6} />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Переводы (EN/ES)</CardTitle>
            <CardDescription>
              Если поля пустые — на сайте будет использоваться русский текст.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              <div className="rounded-2xl border border-border bg-muted/30 p-4">
                <div className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                  English (EN)
                </div>
                <div className="mt-3 space-y-3">
                  <div className="space-y-2">
                    <Label>Title</Label>
                    <Input name="tr_title_en" defaultValue={trEn?.title ?? ""} />
                  </div>
                  <div className="space-y-2">
                    <Label>Description</Label>
                    <Textarea
                      name="tr_description_en"
                      defaultValue={trEn?.description ?? ""}
                      rows={5}
                    />
                  </div>
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label>SEO title</Label>
                      <Input name="tr_seoTitle_en" defaultValue={trEn?.seoTitle ?? ""} />
                    </div>
                    <div className="space-y-2">
                      <Label>SEO description</Label>
                      <Input
                        name="tr_seoDescription_en"
                        defaultValue={trEn?.seoDescription ?? ""}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-border bg-muted/30 p-4">
                <div className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                  Español (ES)
                </div>
                <div className="mt-3 space-y-3">
                  <div className="space-y-2">
                    <Label>Título</Label>
                    <Input name="tr_title_es" defaultValue={trEs?.title ?? ""} />
                  </div>
                  <div className="space-y-2">
                    <Label>Descripción</Label>
                    <Textarea
                      name="tr_description_es"
                      defaultValue={trEs?.description ?? ""}
                      rows={5}
                    />
                  </div>
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label>SEO título</Label>
                      <Input name="tr_seoTitle_es" defaultValue={trEs?.seoTitle ?? ""} />
                    </div>
                    <div className="space-y-2">
                      <Label>SEO descripción</Label>
                      <Input
                        name="tr_seoDescription_es"
                        defaultValue={trEs?.seoDescription ?? ""}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <CardTitle>Теги</CardTitle>
                <CardDescription>
                  Эти теги переводятся на сайте (ru/en/es) и выбираются из списка.
                </CardDescription>
              </div>
              <div className="text-xs text-muted-foreground">
                Раздел:{" "}
                <span className="font-semibold text-foreground">
                  {isSale ? "Продажа" : "Аренда"}
                </span>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {availableTags.map((t) => {
                const ru = pickTranslatedLabel(t.translations, "ru", t.key);
                return (
                  <label
                    key={t.id}
                    className="flex items-start gap-2 rounded-xl border border-border bg-muted/30 px-3 py-2 text-xs hover:bg-muted/50"
                  >
                    <input
                      type="checkbox"
                      name="tagIds"
                      value={t.id}
                      defaultChecked={selectedTagIds.has(t.id)}
                      className="mt-0.5 accent-[hsl(var(--primary))]"
                    />
                    <span className="min-w-0">
                      <span className="font-semibold">{ru}</span>{" "}
                      <span className="text-muted-foreground">({t.key})</span>
                      <span className="ml-2 text-[11px] text-muted-foreground">
                        · объектов: {t._count.properties}
                      </span>
                    </span>
                  </label>
                );
              })}
              {!availableTags.length ? (
                <div className="text-sm text-muted-foreground">
                  Нет тегов для этого раздела. Создайте их в{" "}
                  <Link className="underline hover:text-foreground" href="/admin/tags">
                    /admin/tags
                  </Link>
                  .
                </div>
              ) : null}
            </div>
          </CardContent>
        </Card>

        <div className="flex flex-col-reverse items-start justify-between gap-3 sm:flex-row sm:items-center">
          <Button asChild variant="link" className="px-0">
            <Link href={`/ru/property/${property.slug}`}>Открыть объект на сайте</Link>
          </Button>
          <Button type="submit">Сохранить</Button>
        </div>
      </form>

      <form
        action={deleteProperty}
        className="mt-4 flex items-center justify-end"
      >
        <input type="hidden" name="id" defaultValue={property.id} />
        <Button type="submit" variant="destructive">
          Удалить объект
        </Button>
      </form>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Фотографии объекта</CardTitle>
          <CardDescription>
            Загрузите новые фотографии и управляйте тем, какая считается основной. В списке ниже показываются имена файлов.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            action={addImage}
            className="flex flex-col gap-3 rounded-xl border border-border bg-muted/30 p-4 text-xs md:flex-row md:items-end"
          >
            <input type="hidden" name="propertyId" defaultValue={property.id} />
            <div className="flex-1 space-y-1">
              <div className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
                Файл изображения
              </div>
              <input
                type="file"
                name="file"
                accept="image/*"
                required
                className="block w-full text-xs file:mr-3 file:rounded-md file:border-0 file:bg-secondary file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-secondary-foreground hover:file:opacity-90"
              />
            </div>
            <div className="flex-1 space-y-1">
              <div className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
                Подпись (alt)
              </div>
              <Input name="alt" placeholder="Например: гостиная, вид с террасы…" />
            </div>
            <Button type="submit">Добавить фото</Button>
          </form>

          <div className="mt-4 overflow-hidden rounded-xl border border-border">
            <Table className="text-xs">
              <TableHeader>
                <TableRow>
                  <TableHead className="px-3">Файл</TableHead>
                  <TableHead className="px-3">Alt</TableHead>
                  <TableHead className="px-3">Основное</TableHead>
                  <TableHead className="px-3 text-right">Действия</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {property.images.map((img) => {
                  const fileName = img.url.split("/").pop();
                  return (
                    <TableRow key={img.id}>
                      <TableCell className="px-3">{fileName}</TableCell>
                      <TableCell className="px-3 whitespace-normal text-muted-foreground">
                        {img.alt}
                      </TableCell>
                      <TableCell className="px-3">
                        {img.isMain ? <Badge variant="default">Основное</Badge> : null}
                      </TableCell>
                      <TableCell className="px-3 text-right">
                        <div className="flex flex-wrap items-center justify-end gap-2">
                          {!img.isMain && (
                            <form action={setMainImage}>
                              <input type="hidden" name="propertyId" defaultValue={property.id} />
                              <input type="hidden" name="imageId" defaultValue={img.id} />
                              <Button type="submit" size="sm" variant="outline">
                                Сделать главным
                              </Button>
                            </form>
                          )}
                          <form action={deleteImage}>
                            <input type="hidden" name="propertyId" defaultValue={property.id} />
                            <input type="hidden" name="imageId" defaultValue={img.id} />
                            <Button type="submit" size="sm" variant="destructive">
                              Удалить
                            </Button>
                          </form>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

