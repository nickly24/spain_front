import { redirect } from "next/navigation";
import path from "path";
import { promises as fs } from "fs";
import { prisma } from "../../../../lib/prisma";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { PropertyImagePicker } from "@/components/admin/PropertyImagePicker";

async function createProperty(formData) {
  "use server";

  const title = formData.get("title")?.toString() || "";
  const slug = formData.get("slug")?.toString() || "";
  const cityId = Number(formData.get("cityId") || 0) || null;
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
  const trTitleEn = formData.get("tr_title_en")?.toString() || "";
  const trDescEn = formData.get("tr_description_en")?.toString() || "";
  const trSeoTitleEn = formData.get("tr_seoTitle_en")?.toString() || "";
  const trSeoDescEn = formData.get("tr_seoDescription_en")?.toString() || "";

  const trTitleEs = formData.get("tr_title_es")?.toString() || "";
  const trDescEs = formData.get("tr_description_es")?.toString() || "";
  const trSeoTitleEs = formData.get("tr_seoTitle_es")?.toString() || "";
  const trSeoDescEs = formData.get("tr_seoDescription_es")?.toString() || "";

  const tagIds = formData
    .getAll("tagIds")
    .map((v) => Number(v))
    .filter((n) => Number.isFinite(n) && n > 0);

  const section = listingType === "rent" ? "rent" : "sale";

  let cityLabelRu = "";
  if (cityId) {
    const city = await prisma.city.findUnique({
      where: { id: cityId },
      include: { translations: true },
    });
    if (city?.translations) {
      cityLabelRu =
        city.translations.find((t) => t.locale === "ru")?.label ||
        city.translations[0]?.label ||
        "";
    }
  }

  const created = await prisma.property.create({
    data: {
      title,
      slug,
      city: cityLabelRu,
      cityId: cityId || null,
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

  // Теги (с учётом раздела sale/rent)
  if (tagIds.length) {
    const allowed = await prisma.tag.findMany({
      where: { id: { in: tagIds }, section },
      select: { id: true },
    });
    const allowedIds = allowed.map((t) => t.id);
    if (allowedIds.length) {
      await prisma.propertyTag.createMany({
        data: allowedIds.map((tagId) => ({ propertyId: created.id, tagId })),
        skipDuplicates: true,
      });
    }
  }

  // Переводы EN/ES
  async function createTranslation(locale, data) {
    const hasAny =
      (data.title || "").trim() ||
      (data.description || "").trim() ||
      (data.seoTitle || "").trim() ||
      (data.seoDescription || "").trim();
    if (!hasAny) return;

    const safeTitle = (data.title || "").trim() || title;
    const safeDesc = (data.description || "").trim() || description;

    await prisma.propertyTranslation.create({
      data: {
        propertyId: created.id,
        locale,
        title: safeTitle,
        description: safeDesc,
        seoTitle: (data.seoTitle || "").trim() || null,
        seoDescription: (data.seoDescription || "").trim() || null,
      },
    });
  }

  await createTranslation("en", {
    title: trTitleEn,
    description: trDescEn,
    seoTitle: trSeoTitleEn,
    seoDescription: trSeoDescEn,
  });
  await createTranslation("es", {
    title: trTitleEs,
    description: trDescEs,
    seoTitle: trSeoTitleEs,
    seoDescription: trSeoDescEs,
  });

  // Загрузка фотографий сразу при создании объекта
  const files = formData.getAll("images").filter((file) => file && typeof file !== "string");
  if (files.length) {
    const keptIndexesRaw = formData
      .getAll("imageKeep")
      .map((v) => Number(v))
      .filter((n) => Number.isFinite(n) && n >= 0);
    const mainOrderRaw = Number(formData.get("imageMainOrder") ?? 0);

    const indexSequence =
      keptIndexesRaw.length > 0
        ? keptIndexesRaw
        : files.map((_, index) => index);

    const safeMainOrder =
      mainOrderRaw >= 0 && mainOrderRaw < indexSequence.length ? mainOrderRaw : 0;

    const uploadsDir = path.join(process.cwd(), "public", "uploads");
    await fs.mkdir(uploadsDir, { recursive: true });

    let sortOrder = 1;
    for (let orderIndex = 0; orderIndex < indexSequence.length; orderIndex++) {
      const fileIndex = indexSequence[orderIndex];
      const file = files[fileIndex];
      if (!file || typeof file === "string") continue;

      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const originalName = (file.name || "image").toString();
      const ext = path.extname(originalName) || ".jpg";
      const base = path
        .basename(originalName, ext)
        .replace(/[^a-zA-Z0-9_-]/g, "_")
        .toLowerCase();
      const filename = `${base}_${Date.now()}_${orderIndex}${ext}`;
      const filePath = path.join(uploadsDir, filename);
      const publicUrl = `/uploads/${filename}`;

      await fs.writeFile(filePath, buffer);

      await prisma.propertyImage.create({
        data: {
          propertyId: created.id,
          url: publicUrl,
          alt: title || originalName,
          sortOrder: sortOrder++,
          isMain: orderIndex === safeMainOrder,
        },
      });
    }
  }

  redirect(`/admin/properties/${created.id}`);
}

export default async function AdminPropertyCreatePage() {
  const [tagsSale, tagsRent, cities] = await Promise.all([
    prisma.tag.findMany({
      where: { section: "sale" },
      orderBy: [{ visible: "desc" }, { sortOrder: "asc" }, { id: "asc" }],
      include: { translations: true, _count: { select: { properties: true } } },
    }),
    prisma.tag.findMany({
      where: { section: "rent" },
      orderBy: [{ visible: "desc" }, { sortOrder: "asc" }, { id: "asc" }],
      include: { translations: true, _count: { select: { properties: true } } },
    }),
    prisma.city.findMany({
      where: { visible: true },
      orderBy: [{ sortOrder: "asc" }, { id: "asc" }],
      include: { translations: true },
    }),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Новый объект</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Создание объекта для продажи или аренды. После сохранения можно будет
          донастроить остальные поля.
        </p>
      </div>

      <form action={createProperty} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Базовые данные</CardTitle>
            <CardDescription>Можно заполнить минимально, остальное — после создания.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Заголовок</Label>
                  <Input name="title" />
                </div>
                <div className="space-y-2">
                  <Label>Slug (URL)</Label>
                  <Input name="slug" />
                </div>
                <div className="space-y-2">
                  <Label>Город</Label>
                  <select
                    name="cityId"
                    defaultValue=""
                    className="h-10 w-full rounded-xl border border-input bg-background px-3 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <option value="">Выберите город</option>
                    {cities.map((c) => {
                      const ru =
                        c.translations.find((t) => t.locale === "ru")?.label ||
                        c.translations[0]?.label ||
                        c.key;
                      return (
                        <option key={c.id} value={c.id}>
                          {ru}
                        </option>
                      );
                    })}
                  </select>
                </div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <div className="space-y-2">
                    <Label>Формат</Label>
                    <select
                      name="listingType"
                      defaultValue="sale"
                      className="h-10 w-full rounded-xl border border-input bg-background px-3 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                      <option value="sale">Продажа</option>
                      <option value="rent">Аренда</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label>Спальни</Label>
                    <Input name="bedrooms" type="number" defaultValue={0} />
                  </div>
                  <div className="space-y-2">
                    <Label>Площадь, м²</Label>
                    <Input name="areaM2" type="number" defaultValue={0} />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Цена, €</Label>
                    <Input name="priceEur" type="number" />
                  </div>
                  <div className="space-y-2">
                    <Label>Аренда, €/мес</Label>
                    <Input name="rentEurPerMonth" type="number" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Описание</Label>
                  <Textarea name="description" rows={6} />
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
                    <Input name="tr_title_en" />
                  </div>
                  <div className="space-y-2">
                    <Label>Description</Label>
                    <Textarea name="tr_description_en" rows={5} />
                  </div>
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label>SEO title</Label>
                      <Input name="tr_seoTitle_en" />
                    </div>
                    <div className="space-y-2">
                      <Label>SEO description</Label>
                      <Input name="tr_seoDescription_en" />
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
                    <Input name="tr_title_es" />
                  </div>
                  <div className="space-y-2">
                    <Label>Descripción</Label>
                    <Textarea name="tr_description_es" rows={5} />
                  </div>
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label>SEO título</Label>
                      <Input name="tr_seoTitle_es" />
                    </div>
                    <div className="space-y-2">
                      <Label>SEO descripción</Label>
                      <Input name="tr_seoDescription_es" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Статус и метрики</CardTitle>
              <CardDescription>Можно сразу задать статус и базовые показатели.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Статус</Label>
                <select
                  name="status"
                  defaultValue="draft"
                  className="h-10 w-full rounded-xl border border-input bg-background px-3 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <option value="draft">Черновик</option>
                  <option value="published">Опубликован</option>
                  <option value="archived">Архив</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Просмотры</Label>
                  <Input name="views" type="number" defaultValue={0} />
                </div>
                <div className="space-y-2">
                  <Label>Рейтинг (0-5)</Label>
                  <Input name="rating" type="number" step="0.1" min="0" max="5" defaultValue={0} />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Фотографии</CardTitle>
              <CardDescription>
                Можно сразу загрузить фото. Первая загруженная фотография станет главной.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <PropertyImagePicker />
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <CardTitle>Теги</CardTitle>
                <CardDescription>
                  Эти теги переводятся на сайте (ru/en/es) и выбираются из списка. Выберите теги
                  подходящего раздела — Продажа или Аренда.
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <div className="mb-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                Раздел: Продажа
              </div>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
                {tagsSale.map((t) => (
                  <label
                    key={`sale-${t.id}`}
                    className="flex items-start gap-2 rounded-xl border border-border bg-muted/30 px-3 py-2 text-xs hover:bg-muted/50"
                  >
                    <input
                      type="checkbox"
                      name="tagIds"
                      value={t.id}
                      className="mt-0.5 accent-primary"
                    />
                    <span className="min-w-0">
                      <span className="font-semibold">
                        {t.translations.find((tr) => tr.locale === "ru")?.label || t.key}
                      </span>{" "}
                      <span className="text-muted-foreground">({t.key})</span>
                      <span className="ml-2 text-[11px] text-muted-foreground">
                        · объектов: {t._count.properties}
                      </span>
                    </span>
                  </label>
                ))}
                {!tagsSale.length ? (
                  <div className="text-sm text-muted-foreground">
                    Нет тегов для раздела Продажа. Создайте их в /admin/tags.
                  </div>
                ) : null}
              </div>
            </div>

            <div>
              <div className="mb-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                Раздел: Аренда
              </div>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
                {tagsRent.map((t) => (
                  <label
                    key={`rent-${t.id}`}
                    className="flex items-start gap-2 rounded-xl border border-border bg-muted/30 px-3 py-2 text-xs hover:bg-muted/50"
                  >
                    <input
                      type="checkbox"
                      name="tagIds"
                      value={t.id}
                      className="mt-0.5 accent-primary"
                    />
                    <span className="min-w-0">
                      <span className="font-semibold">
                        {t.translations.find((tr) => tr.locale === "ru")?.label || t.key}
                      </span>{" "}
                      <span className="text-muted-foreground">({t.key})</span>
                      <span className="ml-2 text-[11px] text-muted-foreground">
                        · объектов: {t._count.properties}
                      </span>
                    </span>
                  </label>
                ))}
                {!tagsRent.length ? (
                  <div className="text-sm text-muted-foreground">
                    Нет тегов для раздела Аренда. Создайте их в /admin/tags.
                  </div>
                ) : null}
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex items-center justify-end">
          <Button type="submit">Создать объект</Button>
        </div>
      </form>
    </div>
  );
}

