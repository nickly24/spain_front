import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "../../../lib/prisma";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const dynamic = "force-dynamic";

async function saveContact(formData) {
  "use server";

  const idRaw = formData.get("id")?.toString();
  if (!idRaw) return;
  const id = Number(idRaw);
  if (!Number.isFinite(id)) return;

  const phone = formData.get("phone")?.toString() || "";

  if (!phone) return;

  const locales = ["ru", "en", "es"];
  const fields = ["topic", "name", "person", "languages"];
  const byLocale = {};
  for (const locale of locales) {
    byLocale[locale] = {};
    for (const f of fields) {
      const v = formData.get(`${f}_${locale}`)?.toString() || "";
      byLocale[locale][f] = v.trim() || null;
    }
  }

  // Для удобства: базовые поля Contact держим как RU-fallback (если ru заполнен).
  const baseTopic = byLocale.ru.topic || "";
  const baseName = byLocale.ru.name || "";
  const basePerson = byLocale.ru.person || "";
  const baseLanguages = byLocale.ru.languages || null;

  await prisma.$transaction(async (tx) => {
    await tx.contact.update({
      where: { id },
      data: {
        topic: baseTopic,
        name: baseName,
        person: basePerson,
        phone,
        languages: baseLanguages,
      },
    });

    for (const locale of locales) {
      await tx.contactTranslation.upsert({
        where: { contactId_locale: { contactId: id, locale } },
        update: {
          topic: byLocale[locale].topic,
          name: byLocale[locale].name,
          person: byLocale[locale].person,
          languages: byLocale[locale].languages,
        },
        create: {
          contactId: id,
          locale,
          topic: byLocale[locale].topic,
          name: byLocale[locale].name,
          person: byLocale[locale].person,
          languages: byLocale[locale].languages,
        },
      });
    }
  });

  revalidatePath("/", "layout");
  redirect(`/admin/contacts?message=${encodeURIComponent("Контакт сохранён")}&type=success`);
}

export default async function AdminContactsPage() {
  const contacts = await prisma.contact.findMany({
    where: { type: "phone" },
    orderBy: { id: "asc" },
    include: { translations: true },
  });

  const locales = [
    { id: "ru", label: "RU" },
    { id: "en", label: "EN" },
    { id: "es", label: "ES" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Контакты</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Телефоны, ответственные менеджеры и языки, на которых можно говорить
          по каждому номеру.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {contacts.map((c) => (
          <form
            key={c.id}
            action={saveContact}
            className="space-y-3 rounded-2xl border border-border bg-card p-5 shadow-soft"
          >
            <input type="hidden" name="id" defaultValue={c.id} />
            <div className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              Телефон #{c.id}
            </div>

            <div className="space-y-1">
              <Label className="text-[11px] uppercase tracking-widest text-muted-foreground">
                Телефон (как показываем на сайте)
              </Label>
              <Input name="phone" defaultValue={c.phone} className="h-9 text-xs" />
            </div>

            <div className="rounded-xl border border-border bg-muted/30 p-4">
              <div className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
                Переводы
              </div>
              <div className="mt-3 grid grid-cols-1 gap-4">
                {locales.map((loc) => {
                  const tr = (c.translations || []).find((t) => t.locale === loc.id) || {};
                  return (
                    <div key={loc.id} className="rounded-xl border border-border bg-background p-3">
                      <div className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
                        {loc.label}
                      </div>
                      <div className="mt-2 grid grid-cols-1 gap-2">
                        <label className="block">
                          <div className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                            Направление / тема
                          </div>
                          <Input
                            name={`topic_${loc.id}`}
                            defaultValue={tr.topic || (loc.id === "ru" ? c.topic : "")}
                            className="mt-1 h-9 text-xs"
                          />
                        </label>
                        <label className="block">
                          <div className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                            Название блока
                          </div>
                          <Input
                            name={`name_${loc.id}`}
                            defaultValue={tr.name || (loc.id === "ru" ? c.name || "" : "")}
                            className="mt-1 h-9 text-xs"
                          />
                        </label>
                        <label className="block">
                          <div className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                            Менеджер / контактное лицо
                          </div>
                          <Input
                            name={`person_${loc.id}`}
                            defaultValue={tr.person || (loc.id === "ru" ? c.person || "" : "")}
                            className="mt-1 h-9 text-xs"
                          />
                        </label>
                        <label className="block">
                          <div className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                            Языки
                          </div>
                          <Input
                            name={`languages_${loc.id}`}
                            defaultValue={tr.languages || (loc.id === "ru" ? c.languages || "" : "")}
                            placeholder={loc.id === "ru" ? "Например: RU / EN / ES" : "e.g. RU / EN / ES"}
                            className="mt-1 h-9 text-xs"
                          />
                        </label>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="pt-1 text-right">
              <Button type="submit" size="sm">Сохранить</Button>
            </div>
          </form>
        ))}
      </div>
    </div>
  );
}

