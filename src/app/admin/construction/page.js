import { redirect } from "next/navigation";
import Link from "next/link";
import { prisma } from "../../../lib/prisma";
import { Button } from "@/components/ui/button";
import { SubmitButton } from "@/components/FormWithPending";

export const dynamic = "force-dynamic";

const LOCALES = [
  { id: "ru", label: "RU" },
  { id: "en", label: "EN" },
  { id: "es", label: "ES" },
];

function pickTr(translations, locale) {
  const list = Array.isArray(translations) ? translations : [];
  return list.find((t) => t.locale === locale) || null;
}


async function saveStep(formData) {
  "use server";
  const id = Number(formData.get("id"));
  if (!id) return;

  const order = Number(formData.get("order") || 0) || 0;

  const byLocale = {};
  for (const loc of LOCALES) {
    byLocale[loc.id] = {
      title: (formData.get(`title_${loc.id}`)?.toString() || "").trim(),
      text: (formData.get(`text_${loc.id}`)?.toString() || "").trim(),
    };
  }

  try {
    await prisma.$transaction(async (tx) => {
      // base = RU fallback
      await tx.constructionStep.update({
        where: { id },
        data: {
          order,
          title: byLocale.ru.title || "",
          text: byLocale.ru.text || "",
        },
      });

      for (const loc of LOCALES) {
        const v = byLocale[loc.id];
        await tx.constructionStepTranslation.upsert({
          where: { stepId_locale: { stepId: id, locale: loc.id } },
          update: { title: v.title || "", text: v.text || "" },
          create: { stepId: id, locale: loc.id, title: v.title || "", text: v.text || "" },
        });
      }
    });
    redirect(`/admin/construction?message=${encodeURIComponent("Этап сохранён")}&type=success`);
  } catch (error) {
    redirect(`/admin/construction?message=${encodeURIComponent("Ошибка при сохранении этапа")}&type=error`);
  }
}

async function saveService(formData) {
  "use server";
  const id = Number(formData.get("id"));
  if (!id) return;

  const sortOrder = Number(formData.get("sortOrder") || 0) || 0;
  const iconUrl = (formData.get("iconUrl")?.toString() || "").trim() || null;

  const byLocale = {};
  for (const loc of LOCALES) {
    byLocale[loc.id] = {
      title: (formData.get(`title_${loc.id}`)?.toString() || "").trim(),
      text: (formData.get(`text_${loc.id}`)?.toString() || "").trim(),
    };
  }

  try {
    await prisma.$transaction(async (tx) => {
      await tx.constructionService.update({
        where: { id },
        data: {
          sortOrder,
          iconUrl,
          title: byLocale.ru.title || "",
          text: byLocale.ru.text || "",
        },
      });

      for (const loc of LOCALES) {
        const v = byLocale[loc.id];
        await tx.constructionServiceTranslation.upsert({
          where: { serviceId_locale: { serviceId: id, locale: loc.id } },
          update: { title: v.title || "", text: v.text || "" },
          create: { serviceId: id, locale: loc.id, title: v.title || "", text: v.text || "" },
        });
      }
    });
    redirect(`/admin/construction?message=${encodeURIComponent("Услуга сохранена")}&type=success`);
  } catch (error) {
    redirect(`/admin/construction?message=${encodeURIComponent("Ошибка при сохранении услуги")}&type=error`);
  }
}


export default async function AdminConstructionPage() {
  const [steps, services] = await Promise.all([
    prisma.constructionStep.findMany({ orderBy: { order: "asc" }, include: { translations: true } }),
    prisma.constructionService.findMany({ orderBy: { sortOrder: "asc" }, include: { translations: true } }),
  ]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Этапы и услуги</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Редактирование этапов строительства и предоставляемых услуг (ru/en/es).
          </p>
        </div>
        <Button asChild variant="outline" size="sm">
          <Link href="/admin/construction/cases">Кейсы до/после →</Link>
        </Button>
      </div>

      <div className="space-y-6">
        <section className="rounded-2xl border border-border bg-card p-5 shadow-soft">
          <div className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            Этапы процесса
          </div>
          <div className="mt-4 space-y-4">
            {steps.map((s) => (
              <form key={s.id} action={saveStep} className="rounded-2xl border border-border bg-muted/30 p-4">
                <input type="hidden" name="id" defaultValue={s.id} />
                <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                  <div className="text-sm font-semibold text-foreground">
                    Этап #{String(s.order).padStart(2, "0")}
                  </div>
                  <label className="block">
                    <div className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
                      Порядок
                    </div>
                    <input
                      name="order"
                      type="number"
                      defaultValue={s.order}
                      className="mt-1 w-28 rounded-xl border border-input bg-background px-3 py-1.5 text-xs text-foreground shadow-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    />
                  </label>
                </div>

                <div className="mt-3 grid grid-cols-1 gap-3 lg:grid-cols-3">
                  {LOCALES.map((loc) => {
                    const tr = pickTr(s.translations, loc.id) || {};
                    const title = tr.title || (loc.id === "ru" ? s.title : "");
                    const text = tr.text || (loc.id === "ru" ? s.text : "");
                    return (
                      <div key={loc.id} className="rounded-xl border border-border bg-background p-3">
                        <div className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
                          {loc.label}
                        </div>
                        <label className="mt-2 block">
                          <div className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                            Заголовок
                          </div>
                          <input
                            name={`title_${loc.id}`}
                            defaultValue={title}
                            className="mt-1 w-full rounded-xl border border-input bg-background px-3 py-1.5 text-xs text-foreground shadow-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
                          />
                        </label>
                        <label className="mt-2 block">
                          <div className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                            Текст
                          </div>
                          <textarea
                            name={`text_${loc.id}`}
                            defaultValue={text}
                            rows={4}
                            className="mt-1 w-full rounded-xl border border-input bg-background px-3 py-1.5 text-xs text-foreground shadow-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
                          />
                        </label>
                      </div>
                    );
                  })}
                </div>

                <div className="mt-3 flex justify-end">
                  <SubmitButton size="sm">Сохранить этап</SubmitButton>
                </div>
              </form>
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-border bg-card p-5 shadow-soft">
          <div className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            Услуги
          </div>
          <div className="mt-4 space-y-4">
            {services.map((s) => (
              <form key={s.id} action={saveService} className="rounded-2xl border border-border bg-muted/30 p-4">
                <input type="hidden" name="id" defaultValue={s.id} />
                <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                  <div className="text-sm font-semibold text-foreground">
                    Услуга #{s.id}
                  </div>
                  <div className="flex flex-wrap items-end gap-3">
                    <label className="block">
                      <div className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
                        Sort
                      </div>
                      <input
                        name="sortOrder"
                        type="number"
                        defaultValue={s.sortOrder}
                        className="mt-1 w-28 rounded-xl border border-input bg-background px-3 py-1.5 text-xs text-foreground shadow-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      />
                    </label>
                    <label className="block">
                      <div className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
                        Icon URL
                      </div>
                      <input
                        name="iconUrl"
                        defaultValue={s.iconUrl || ""}
                        className="mt-1 w-64 rounded-xl border border-input bg-background px-3 py-1.5 text-xs text-foreground shadow-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      />
                    </label>
                  </div>
                </div>

                <div className="mt-3 grid grid-cols-1 gap-3 lg:grid-cols-3">
                  {LOCALES.map((loc) => {
                    const tr = pickTr(s.translations, loc.id) || {};
                    const title = tr.title || (loc.id === "ru" ? s.title : "");
                    const text = tr.text || (loc.id === "ru" ? s.text : "");
                    return (
                      <div key={loc.id} className="rounded-xl border border-border bg-background p-3">
                        <div className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
                          {loc.label}
                        </div>
                        <label className="mt-2 block">
                          <div className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                            Заголовок
                          </div>
                          <input
                            name={`title_${loc.id}`}
                            defaultValue={title}
                            className="mt-1 w-full rounded-xl border border-input bg-background px-3 py-1.5 text-xs text-foreground shadow-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
                          />
                        </label>
                        <label className="mt-2 block">
                          <div className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                            Текст
                          </div>
                          <textarea
                            name={`text_${loc.id}`}
                            defaultValue={text}
                            rows={4}
                            className="mt-1 w-full rounded-xl border border-input bg-background px-3 py-1.5 text-xs text-foreground shadow-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
                          />
                        </label>
                      </div>
                    );
                  })}
                </div>

                <div className="mt-3 flex justify-end">
                  <SubmitButton size="sm">Сохранить услугу</SubmitButton>
                </div>
              </form>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

