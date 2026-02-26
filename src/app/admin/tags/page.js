import { redirect } from "next/navigation";
import { prisma } from "../../../lib/prisma";
import { defaultBadgeTranslations, normalizeTagKey, pickTranslatedLabel } from "../../../lib/tags";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input as UiInput } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const dynamic = "force-dynamic";

async function createTag(formData) {
  "use server";

  const section = formData.get("section")?.toString() || "sale";
  const rawKey = formData.get("key")?.toString() || "";
  const keyBase = normalizeTagKey(rawKey) || normalizeTagKey(formData.get("label_ru")?.toString() || "");
  if (!keyBase) return;

  const sortOrder = Number(formData.get("sortOrder") || 0) || 0;
  const visible = formData.get("visible")?.toString() === "on";

  const labelRu = (formData.get("label_ru")?.toString() || "").trim();
  const labelEn = (formData.get("label_en")?.toString() || "").trim();
  const labelEs = (formData.get("label_es")?.toString() || "").trim();

  let key = keyBase;
  for (let i = 2; i < 1000; i++) {
    const exists = await prisma.tag.findFirst({ where: { section, key } });
    if (!exists) break;
    key = `${keyBase}-${i}`;
  }

  const created = await prisma.tag.create({
    data: {
      section,
      key,
      sortOrder,
      visible,
      translations: {
        createMany: {
          data: [
            { locale: "ru", label: labelRu || key },
            { locale: "en", label: labelEn || labelRu || key },
            { locale: "es", label: labelEs || labelRu || key },
          ],
        },
      },
    },
  });

  redirect(`/admin/tags#tag-${created.id}`);
}

async function updateTag(formData) {
  "use server";

  const id = Number(formData.get("id"));
  if (!id) return;
  const section = formData.get("section")?.toString() || "sale";
  const key = normalizeTagKey(formData.get("key")?.toString() || "");
  const sortOrder = Number(formData.get("sortOrder") || 0) || 0;
  const visible = formData.get("visible")?.toString() === "on";

  const labelRu = (formData.get("label_ru")?.toString() || "").trim();
  const labelEn = (formData.get("label_en")?.toString() || "").trim();
  const labelEs = (formData.get("label_es")?.toString() || "").trim();

  if (!key) return;

  await prisma.$transaction(async (tx) => {
    await tx.tag.update({
      where: { id },
      data: { section, key, sortOrder, visible },
    });

    const entries = [
      { locale: "ru", label: labelRu || key },
      { locale: "en", label: labelEn || labelRu || key },
      { locale: "es", label: labelEs || labelRu || key },
    ];

    for (const e of entries) {
      await tx.tagTranslation.upsert({
        where: { tagId_locale: { tagId: id, locale: e.locale } },
        update: { label: e.label },
        create: { tagId: id, locale: e.locale, label: e.label },
      });
    }
  });

  redirect(`/admin/tags#tag-${id}`);
}

async function deleteTag(formData) {
  "use server";

  const id = Number(formData.get("id"));
  if (!id) return;
  await prisma.tag.delete({ where: { id } });
  redirect("/admin/tags");
}

async function importBadges() {
  "use server";

  const props = await prisma.property.findMany({
    where: { badges: { not: null } },
    select: { id: true, listingType: true, badges: true },
  });

  await prisma.$transaction(async (tx) => {
    for (const p of props) {
      const section = p.listingType === "rent" ? "rent" : "sale";
      const badges = Array.isArray(p.badges) ? p.badges : [];
      for (const raw of badges) {
        const ruLabel = String(raw || "").trim();
        if (!ruLabel) continue;

        const tr = defaultBadgeTranslations(ruLabel);
        const keyBase = normalizeTagKey(tr.ru);
        if (!keyBase) continue;

        let tag = await tx.tag.findFirst({ where: { section, key: keyBase } });
        if (!tag) {
          let key = keyBase;
          for (let i = 2; i < 1000; i++) {
            const exists = await tx.tag.findFirst({ where: { section, key } });
            if (!exists) break;
            key = `${keyBase}-${i}`;
          }

          tag = await tx.tag.create({
            data: {
              section,
              key,
              sortOrder: 0,
              visible: true,
            },
          });

          await tx.tagTranslation.createMany({
            data: [
              { tagId: tag.id, locale: "ru", label: tr.ru || key },
              { tagId: tag.id, locale: "en", label: tr.en || tr.ru || key },
              { tagId: tag.id, locale: "es", label: tr.es || tr.ru || key },
            ],
          });
        }

        await tx.propertyTag.upsert({
          where: { propertyId_tagId: { propertyId: p.id, tagId: tag.id } },
          update: {},
          create: { propertyId: p.id, tagId: tag.id },
        });
      }
    }
  });

  redirect("/admin/tags");
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

export default async function AdminTagsPage() {
  const tags = await prisma.tag.findMany({
    orderBy: [{ section: "asc" }, { visible: "desc" }, { sortOrder: "asc" }, { id: "asc" }],
    include: { translations: true, _count: { select: { properties: true } } },
  });

  const sections = [
    { id: "sale", label: "Продажа" },
    { id: "rent", label: "Аренда" },
    { id: "construction", label: "Строительство" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Теги</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Переводимые теги (ru/en/es), которые админ может добавлять и привязывать к объектам.
          </p>
        </div>

        <form action={importBadges}>
          <Button type="submit" variant="outline">
            Импортировать из старых badges
          </Button>
        </form>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Создать тег</CardTitle>
          <CardDescription>Теги используются в карточках и фильтрах.</CardDescription>
        </CardHeader>
        <CardContent>
        <form action={createTag} className="grid grid-cols-1 gap-3 md:grid-cols-12">
          <label className="block md:col-span-2">
            <div className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">Раздел</div>
            <select
              name="section"
              defaultValue="sale"
              className="mt-1 h-9 w-full rounded-xl border border-input bg-background px-3 text-xs shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              {sections.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.label}
                </option>
              ))}
            </select>
          </label>

          <div className="md:col-span-2">
            <Input label="Key" name="key" placeholder="например: near-the-sea" />
          </div>

          <div className="md:col-span-1">
            <Input label="Sort" name="sortOrder" defaultValue="0" />
          </div>

          <label className="flex items-center gap-2 md:col-span-2 md:mt-6">
            <input type="checkbox" name="visible" defaultChecked className="accent-[hsl(var(--primary))]" />
            <span className="text-xs text-muted-foreground">Виден</span>
          </label>

          <div className="md:col-span-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
            <Input label="Label RU" name="label_ru" placeholder="у моря" />
            <Input label="Label EN" name="label_en" placeholder="Near the sea" />
            <Input label="Label ES" name="label_es" placeholder="Cerca del mar" />
          </div>

          <div className="md:col-span-12 flex justify-end pt-2">
            <Button type="submit">Создать</Button>
          </div>
        </form>
        </CardContent>
      </Card>

      <div className="space-y-4">
        {sections.map((sec) => {
          const list = tags.filter((t) => t.section === sec.id);
          return (
            <section key={sec.id} className="overflow-hidden rounded-2xl border border-border bg-card shadow-soft">
              <div className="flex items-center justify-between border-b border-border px-4 py-3">
                <div className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                  {sec.label} — {list.length}
                </div>
              </div>

              <div className="divide-y divide-slate-800/80">
                {list.map((t) => {
                  const ru = pickTranslatedLabel(t.translations, "ru", t.key);
                  const en = pickTranslatedLabel(t.translations, "en", t.key);
                  const es = pickTranslatedLabel(t.translations, "es", t.key);
                  return (
                    <div key={t.id} id={`tag-${t.id}`} className="px-4 py-4">
                      <form action={updateTag} className="grid grid-cols-1 gap-3 md:grid-cols-12">
                        <input type="hidden" name="id" defaultValue={t.id} />

                        <div className="md:col-span-2">
                          <label className="block space-y-1">
                            <div className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">Раздел</div>
                            <select
                              name="section"
                              defaultValue={t.section}
                              className="h-9 w-full rounded-xl border border-input bg-background px-3 text-xs shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                            >
                              {sections.map((s) => (
                                <option key={s.id} value={s.id}>
                                  {s.label}
                                </option>
                              ))}
                            </select>
                          </label>
                        </div>

                        <div className="md:col-span-2">
                          <Input label="Key" name="key" defaultValue={t.key} />
                        </div>

                        <div className="md:col-span-1">
                          <Input label="Sort" name="sortOrder" defaultValue={String(t.sortOrder)} />
                        </div>

                        <label className="flex items-center gap-2 md:col-span-1 md:mt-6">
                          <input type="checkbox" name="visible" defaultChecked={t.visible} className="accent-[hsl(var(--primary))]" />
                          <span className="text-xs text-muted-foreground">Виден</span>
                        </label>

                        <div className="md:col-span-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
                          <Input label="Label RU" name="label_ru" defaultValue={ru} />
                          <Input label="Label EN" name="label_en" defaultValue={en} />
                          <Input label="Label ES" name="label_es" defaultValue={es} />
                        </div>

                        <div className="md:col-span-1">
                          <label className="block space-y-1">
                            <div className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">Связи</div>
                            <div className="rounded-xl border border-border bg-muted/30 px-3 py-2 text-xs text-muted-foreground">
                              {t._count.properties}
                            </div>
                          </label>
                        </div>

                        <div className="md:col-span-12 flex flex-wrap items-center justify-end gap-2 pt-1">
                          <Button type="submit" size="sm">Сохранить</Button>
                        </div>
                      </form>

                      <form action={deleteTag} className="mt-2 flex justify-end">
                        <input type="hidden" name="id" defaultValue={t.id} />
                        <Button type="submit" size="sm" variant="destructive">Удалить</Button>
                      </form>
                    </div>
                  );
                })}

                {!list.length ? (
                  <div className="px-4 py-6 text-sm text-slate-400">Пока нет тегов.</div>
                ) : null}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}

