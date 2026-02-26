import { redirect } from "next/navigation";
import { prisma } from "../../../lib/prisma";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input as UiInput } from "@/components/ui/input";

export const dynamic = "force-dynamic";

function normalizeKey(input) {
  return String(input || "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\p{L}\p{N}-]+/gu, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

async function createCity(formData) {
  "use server";
  const rawKey = formData.get("key")?.toString() || "";
  const ru = (formData.get("label_ru")?.toString() || "").trim();
  const en = (formData.get("label_en")?.toString() || "").trim();
  const es = (formData.get("label_es")?.toString() || "").trim();
  const sortOrder = Number(formData.get("sortOrder") || 0) || 0;
  const visible = formData.get("visible")?.toString() === "on";

  const keyBase = normalizeKey(rawKey || ru);
  if (!keyBase) return;

  let key = keyBase;
  for (let i = 2; i < 1000; i++) {
    const exists = await prisma.city.findFirst({ where: { key } });
    if (!exists) break;
    key = `${keyBase}-${i}`;
  }

  const created = await prisma.city.create({
    data: {
      key,
      sortOrder,
      visible,
      translations: {
        createMany: {
          data: [
            { locale: "ru", label: ru || key },
            { locale: "en", label: en || ru || key },
            { locale: "es", label: es || ru || key },
          ],
        },
      },
    },
  });

  redirect(`/admin/cities#city-${created.id}`);
}

async function updateCity(formData) {
  "use server";
  const id = Number(formData.get("id"));
  if (!id) return;
  const key = normalizeKey(formData.get("key")?.toString() || "");
  const sortOrder = Number(formData.get("sortOrder") || 0) || 0;
  const visible = formData.get("visible")?.toString() === "on";
  const ru = (formData.get("label_ru")?.toString() || "").trim();
  const en = (formData.get("label_en")?.toString() || "").trim();
  const es = (formData.get("label_es")?.toString() || "").trim();
  if (!key) return;

  await prisma.$transaction(async (tx) => {
    await tx.city.update({ where: { id }, data: { key, sortOrder, visible } });
    const rows = [
      { locale: "ru", label: ru || key },
      { locale: "en", label: en || ru || key },
      { locale: "es", label: es || ru || key },
    ];
    for (const r of rows) {
      await tx.cityTranslation.upsert({
        where: { cityId_locale: { cityId: id, locale: r.locale } },
        update: { label: r.label },
        create: { cityId: id, locale: r.locale, label: r.label },
      });
    }
  });

  redirect(`/admin/cities#city-${id}`);
}

async function deleteCity(formData) {
  "use server";
  const id = Number(formData.get("id"));
  if (!id) return;
  await prisma.city.delete({ where: { id } });
  redirect("/admin/cities");
}

async function importFromProperties() {
  "use server";

  const props = await prisma.property.findMany({ select: { id: true, city: true, cityId: true } });
  const unique = new Map();
  for (const p of props) {
    const name = String(p.city || "").trim();
    if (!name) continue;
    if (!unique.has(name)) unique.set(name, []);
    unique.get(name).push(p.id);
  }

  const cityMap = {
    "Торревьеха": { en: "Torrevieja", es: "Torrevieja" },
    "Аликанте": { en: "Alicante", es: "Alicante" },
    "Бенидорм": { en: "Benidorm", es: "Benidorm" },
    "Марбелья": { en: "Marbella", es: "Marbella" },
    "Валенсия": { en: "Valencia", es: "Valencia" },
    "Мадрид": { en: "Madrid", es: "Madrid" },
    "Финестрат": { en: "Finestrat", es: "Finestrat" },
    "Коста-Бланка": { en: "Costa Blanca", es: "Costa Blanca" },
    "Барселона": { en: "Barcelona", es: "Barcelona" },
    "Малага": { en: "Málaga", es: "Málaga" },
    "Валенсия (центр)": { en: "Valencia (Center)", es: "Valencia (Centro)" },
  };

  await prisma.$transaction(async (tx) => {
    for (const [ruLabel, propIds] of unique.entries()) {
      const keyBase = normalizeKey(ruLabel);
      if (!keyBase) continue;
      let city = await tx.city.findFirst({ where: { key: keyBase } });
      if (!city) {
        const hit = cityMap[ruLabel] || {};
        city = await tx.city.create({
          data: { key: keyBase, sortOrder: 0, visible: true },
        });
        await tx.cityTranslation.createMany({
          data: [
            { cityId: city.id, locale: "ru", label: ruLabel },
            { cityId: city.id, locale: "en", label: hit.en || ruLabel },
            { cityId: city.id, locale: "es", label: hit.es || ruLabel },
          ],
        });
      }

      await tx.property.updateMany({
        where: { id: { in: propIds }, cityId: null },
        data: { cityId: city.id },
      });
    }
  });

  redirect("/admin/cities");
}

function pickLabel(translations, locale, fallback) {
  const list = Array.isArray(translations) ? translations : [];
  const direct = list.find((t) => t.locale === locale)?.label;
  if (direct) return direct;
  const ru = list.find((t) => t.locale === "ru")?.label;
  return ru || list[0]?.label || fallback || "";
}

function Input({ label, name, defaultValue = "", placeholder = "" }) {
  return (
    <label className="block space-y-1">
      <div className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
        {label}
      </div>
      <UiInput
        name={name}
        defaultValue={defaultValue}
        placeholder={placeholder}
        className="h-9 text-xs"
      />
    </label>
  );
}

export default async function AdminCitiesPage() {
  const cities = await prisma.city.findMany({
    orderBy: [{ visible: "desc" }, { sortOrder: "asc" }, { id: "asc" }],
    include: { translations: true, _count: { select: { properties: true } } },
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Города</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Переводимые города (ru/en/es). Используются в карточках, фильтрах и на странице объекта.
          </p>
        </div>
        <form action={importFromProperties}>
          <Button type="submit" variant="outline">
            Импортировать из объектов
          </Button>
        </form>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Создать город</CardTitle>
          <CardDescription>Города используются в фильтрах и карточках объектов.</CardDescription>
        </CardHeader>
        <CardContent>
        <form action={createCity} className="grid grid-cols-1 gap-3 md:grid-cols-12">
          <div className="md:col-span-3">
            <Input label="Key" name="key" placeholder="например: torrevieja" />
          </div>
          <div className="md:col-span-1">
            <Input label="Sort" name="sortOrder" defaultValue="0" />
          </div>
          <label className="flex items-center gap-2 md:col-span-2 md:mt-6">
            <input type="checkbox" name="visible" defaultChecked className="accent-[hsl(var(--primary))]" />
            <span className="text-xs text-muted-foreground">Виден</span>
          </label>

          <div className="md:col-span-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
            <Input label="Label RU" name="label_ru" placeholder="Торревьеха" />
            <Input label="Label EN" name="label_en" placeholder="Torrevieja" />
            <Input label="Label ES" name="label_es" placeholder="Torrevieja" />
          </div>

          <div className="md:col-span-12 flex justify-end pt-2">
            <Button type="submit">Создать</Button>
          </div>
        </form>
        </CardContent>
      </Card>

      <div className="space-y-4">
        {cities.map((c) => {
          const ru = pickLabel(c.translations, "ru", c.key);
          const en = pickLabel(c.translations, "en", c.key);
          const es = pickLabel(c.translations, "es", c.key);
          return (
            <section key={c.id} id={`city-${c.id}`} className="rounded-2xl border border-border bg-card p-5 shadow-soft">
              <form action={updateCity} className="grid grid-cols-1 gap-3 md:grid-cols-12">
                <input type="hidden" name="id" defaultValue={c.id} />
                <div className="md:col-span-3">
                  <Input label="Key" name="key" defaultValue={c.key} />
                </div>
                <div className="md:col-span-1">
                  <Input label="Sort" name="sortOrder" defaultValue={String(c.sortOrder)} />
                </div>
                <label className="flex items-center gap-2 md:col-span-2 md:mt-6">
                  <input type="checkbox" name="visible" defaultChecked={c.visible} className="accent-[hsl(var(--primary))]" />
                  <span className="text-xs text-muted-foreground">Виден</span>
                </label>

                <div className="md:col-span-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
                  <Input label="Label RU" name="label_ru" defaultValue={ru} />
                  <Input label="Label EN" name="label_en" defaultValue={en} />
                  <Input label="Label ES" name="label_es" defaultValue={es} />
                </div>

                <div className="md:col-span-1">
                  <label className="block space-y-1">
                    <div className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">Объекты</div>
                    <div className="rounded-xl border border-border bg-muted/30 px-3 py-2 text-xs text-muted-foreground">
                      {c._count.properties}
                    </div>
                  </label>
                </div>

                <div className="md:col-span-12 flex flex-wrap items-center justify-end gap-2 pt-1">
                  <Button type="submit" size="sm">Сохранить</Button>
                </div>
              </form>

              <form action={deleteCity} className="mt-2 flex justify-end">
                <input type="hidden" name="id" defaultValue={c.id} />
                <Button type="submit" size="sm" variant="destructive">Удалить</Button>
              </form>
            </section>
          );
        })}
        {!cities.length ? (
          <div className="text-sm text-slate-400">Пока нет городов.</div>
        ) : null}
      </div>
    </div>
  );
}

