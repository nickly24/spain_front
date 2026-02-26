import path from "path";
import { promises as fs } from "fs";
import { redirect } from "next/navigation";
import { prisma } from "../../../lib/prisma";
import { Button } from "@/components/ui/button";

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

function linesToJsonArray(text) {
  const raw = String(text || "").trim();
  if (!raw) return null;
  const arr = raw
    .split(/\r?\n/g)
    .map((s) => s.trim())
    .filter(Boolean);
  return arr.length ? arr : null;
}

function jsonArrayToLines(value) {
  const arr = Array.isArray(value) ? value : [];
  return arr.filter(Boolean).join("\n");
}

async function saveUploadedFile(file, prefix = "file") {
  if (!file || typeof file === "string") return null;
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const uploadsDir = path.join(process.cwd(), "public", "uploads", "construction");
  await fs.mkdir(uploadsDir, { recursive: true });

  const originalName = (file.name || prefix).toString();
  const ext = path.extname(originalName) || ".jpg";
  const base = path
    .basename(originalName, ext)
    .replace(/[^a-zA-Z0-9_-]/g, "_")
    .toLowerCase()
    .slice(0, 40);

  const filename = `${prefix}_${base}_${Date.now()}${ext}`;
  const abs = path.join(uploadsDir, filename);
  await fs.writeFile(abs, buffer);
  return `/uploads/construction/${filename}`;
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
}

async function saveCase(formData) {
  "use server";
  const id = Number(formData.get("id"));
  if (!id) return;

  const beforeUrlFromInput = (formData.get("beforeUrl")?.toString() || "").trim();
  const afterUrlFromInput = (formData.get("afterUrl")?.toString() || "").trim();
  const beforeFile = formData.get("beforeFile");
  const afterFile = formData.get("afterFile");
  const beforeUrlUploaded = await saveUploadedFile(beforeFile, `case_${id}_before`);
  const afterUrlUploaded = await saveUploadedFile(afterFile, `case_${id}_after`);
  const beforeUrl = beforeUrlUploaded || beforeUrlFromInput;
  const afterUrl = afterUrlUploaded || afterUrlFromInput;

  const byLocale = {};
  for (const loc of LOCALES) {
    byLocale[loc.id] = {
      title: (formData.get(`title_${loc.id}`)?.toString() || "").trim() || null,
      was: linesToJsonArray(formData.get(`was_${loc.id}`)?.toString() || ""),
      done: linesToJsonArray(formData.get(`done_${loc.id}`)?.toString() || ""),
    };
  }

  await prisma.$transaction(async (tx) => {
    await tx.constructionCase.update({
      where: { id },
      data: {
        title: byLocale.ru.title || "",
        beforeUrl,
        afterUrl,
        was: byLocale.ru.was,
        done: byLocale.ru.done,
      },
    });

    for (const loc of LOCALES) {
      const v = byLocale[loc.id];
      await tx.constructionCaseTranslation.upsert({
        where: { caseId_locale: { caseId: id, locale: loc.id } },
        update: {
          title: v.title,
          was: v.was,
          done: v.done,
        },
        create: {
          caseId: id,
          locale: loc.id,
          title: v.title,
          was: v.was,
          done: v.done,
        },
      });
    }
  });
}

async function createCase(formData) {
  "use server";

  const beforeUrlFromInput = (formData.get("beforeUrl")?.toString() || "").trim();
  const afterUrlFromInput = (formData.get("afterUrl")?.toString() || "").trim();
  const beforeFile = formData.get("beforeFile");
  const afterFile = formData.get("afterFile");
  const beforeUrlUploaded = await saveUploadedFile(beforeFile, "case_new_before");
  const afterUrlUploaded = await saveUploadedFile(afterFile, "case_new_after");
  const beforeUrl = beforeUrlUploaded || beforeUrlFromInput;
  const afterUrl = afterUrlUploaded || afterUrlFromInput;

  const byLocale = {};
  for (const loc of LOCALES) {
    byLocale[loc.id] = {
      title: (formData.get(`title_${loc.id}`)?.toString() || "").trim() || null,
      was: linesToJsonArray(formData.get(`was_${loc.id}`)?.toString() || ""),
      done: linesToJsonArray(formData.get(`done_${loc.id}`)?.toString() || ""),
    };
  }

  const created = await prisma.constructionCase.create({
    data: {
      title: byLocale.ru.title || "Новый кейс",
      beforeUrl: beforeUrl || "/photos/image copy 4.png",
      afterUrl: afterUrl || "/photos/image copy 10.png",
      was: byLocale.ru.was,
      done: byLocale.ru.done,
      translations: {
        createMany: {
          data: LOCALES.map((loc) => ({
            locale: loc.id,
            title: byLocale[loc.id].title,
            was: byLocale[loc.id].was,
            done: byLocale[loc.id].done,
          })),
        },
      },
    },
  });

  redirect(`/admin/construction#case-${created.id}`);
}

async function deleteCase(formData) {
  "use server";
  const id = Number(formData.get("id"));
  if (!id) return;
  await prisma.constructionCase.delete({ where: { id } });
  redirect("/admin/construction");
}

export default async function AdminConstructionPage() {
  const [steps, cases, services] = await Promise.all([
    prisma.constructionStep.findMany({ orderBy: { order: "asc" }, include: { translations: true } }),
    prisma.constructionCase.findMany({ orderBy: { id: "asc" }, include: { translations: true } }),
    prisma.constructionService.findMany({ orderBy: { sortOrder: "asc" }, include: { translations: true } }),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Строительство и проекты</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Здесь можно редактировать этапы, услуги и кейсы (ru/en/es).
        </p>
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
                  <Button type="submit" size="sm">Сохранить этап</Button>
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
                  <Button type="submit" size="sm">Сохранить услугу</Button>
                </div>
              </form>
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-slate-800 bg-slate-950/60 p-5">
          <div className="text-xs font-semibold uppercase tracking-widest text-slate-400">
            Кейсы «до/после»
          </div>

          <div className="mt-4 rounded-2xl border border-slate-800 bg-slate-900/40 p-4">
            <div className="text-xs font-semibold uppercase tracking-widest text-slate-400">
              Добавить кейс
            </div>
            <form action={createCase} className="mt-3 space-y-3">
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                <label className="block">
                  <div className="text-[11px] font-semibold uppercase tracking-widest text-slate-500">
                    Before URL (или загрузка)
                  </div>
                  <input
                    name="beforeUrl"
                    placeholder="/uploads/... или /photos/..."
                    className="mt-1 w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-slate-100 outline-none focus:border-slate-500"
                  />
                  <input
                    type="file"
                    name="beforeFile"
                    accept="image/*"
                    className="mt-2 block w-full text-xs text-slate-200 file:mr-3 file:rounded-md file:border-0 file:bg-slate-800 file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-slate-100 hover:file:bg-slate-700"
                  />
                </label>
                <label className="block">
                  <div className="text-[11px] font-semibold uppercase tracking-widest text-slate-500">
                    After URL (или загрузка)
                  </div>
                  <input
                    name="afterUrl"
                    placeholder="/uploads/... или /photos/..."
                    className="mt-1 w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-slate-100 outline-none focus:border-slate-500"
                  />
                  <input
                    type="file"
                    name="afterFile"
                    accept="image/*"
                    className="mt-2 block w-full text-xs text-slate-200 file:mr-3 file:rounded-md file:border-0 file:bg-slate-800 file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-slate-100 hover:file:bg-slate-700"
                  />
                </label>
              </div>

              <div className="grid grid-cols-1 gap-3 lg:grid-cols-3">
                {LOCALES.map((loc) => (
                  <div key={loc.id} className="rounded-xl border border-slate-800 bg-slate-950/50 p-3">
                    <div className="text-[11px] font-semibold uppercase tracking-widest text-slate-500">
                      {loc.label}
                    </div>
                    <label className="mt-2 block">
                      <div className="text-[10px] font-semibold uppercase tracking-widest text-slate-600">
                        Заголовок
                      </div>
                      <input
                        name={`title_${loc.id}`}
                        className="mt-1 w-full rounded-lg border border-slate-800 bg-slate-900 px-3 py-1.5 text-xs text-slate-100 outline-none focus:border-slate-500"
                      />
                    </label>
                    <label className="mt-2 block">
                      <div className="text-[10px] font-semibold uppercase tracking-widest text-slate-600">
                        Что было (по строке)
                      </div>
                      <textarea
                        name={`was_${loc.id}`}
                        rows={3}
                        className="mt-1 w-full rounded-lg border border-slate-800 bg-slate-900 px-3 py-1.5 text-xs text-slate-100 outline-none focus:border-slate-500"
                      />
                    </label>
                    <label className="mt-2 block">
                      <div className="text-[10px] font-semibold uppercase tracking-widest text-slate-600">
                        Что сделали (по строке)
                      </div>
                      <textarea
                        name={`done_${loc.id}`}
                        rows={3}
                        className="mt-1 w-full rounded-lg border border-slate-800 bg-slate-900 px-3 py-1.5 text-xs text-slate-100 outline-none focus:border-slate-500"
                      />
                    </label>
                  </div>
                ))}
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="inline-flex items-center justify-center rounded-full bg-emerald-500 px-4 py-2 text-xs font-semibold text-white hover:bg-emerald-400"
                >
                  Создать кейс
                </button>
              </div>
            </form>
          </div>

          <div className="mt-4 space-y-4">
            {cases.map((c) => (
              <div key={c.id} id={`case-${c.id}`} className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div className="text-sm font-semibold text-slate-100">Кейс #{c.id}</div>
                  <form action={deleteCase}>
                    <input type="hidden" name="id" defaultValue={c.id} />
                    <button
                      type="submit"
                      className="inline-flex items-center justify-center rounded-full border border-rose-900/60 bg-rose-950/40 px-3 py-1 text-xs font-semibold text-rose-200 hover:bg-rose-950/70"
                    >
                      Удалить
                    </button>
                  </form>
                </div>

                <form action={saveCase}>
                  <input type="hidden" name="id" defaultValue={c.id} />

                  <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-2">
                  <label className="block">
                    <div className="text-[11px] font-semibold uppercase tracking-widest text-slate-500">
                      Before URL
                    </div>
                    <input
                      name="beforeUrl"
                      defaultValue={c.beforeUrl}
                      className="mt-1 w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-1.5 text-xs text-slate-100 outline-none focus:border-slate-500"
                    />
                    <input
                      type="file"
                      name="beforeFile"
                      accept="image/*"
                      className="mt-2 block w-full text-xs text-slate-200 file:mr-3 file:rounded-md file:border-0 file:bg-slate-800 file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-slate-100 hover:file:bg-slate-700"
                    />
                  </label>
                  <label className="block">
                    <div className="text-[11px] font-semibold uppercase tracking-widest text-slate-500">
                      After URL
                    </div>
                    <input
                      name="afterUrl"
                      defaultValue={c.afterUrl}
                      className="mt-1 w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-1.5 text-xs text-slate-100 outline-none focus:border-slate-500"
                    />
                    <input
                      type="file"
                      name="afterFile"
                      accept="image/*"
                      className="mt-2 block w-full text-xs text-slate-200 file:mr-3 file:rounded-md file:border-0 file:bg-slate-800 file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-slate-100 hover:file:bg-slate-700"
                    />
                  </label>
                </div>

                <div className="mt-3 grid grid-cols-1 gap-3 lg:grid-cols-3">
                  {LOCALES.map((loc) => {
                    const tr = pickTr(c.translations, loc.id) || {};
                    const title = tr.title || (loc.id === "ru" ? c.title : "");
                    const was = jsonArrayToLines(tr.was ?? (loc.id === "ru" ? c.was : null));
                    const done = jsonArrayToLines(tr.done ?? (loc.id === "ru" ? c.done : null));
                    return (
                      <div key={loc.id} className="rounded-xl border border-slate-800 bg-slate-950/50 p-3">
                        <div className="text-[11px] font-semibold uppercase tracking-widest text-slate-500">
                          {loc.label}
                        </div>
                        <label className="mt-2 block">
                          <div className="text-[10px] font-semibold uppercase tracking-widest text-slate-600">
                            Заголовок
                          </div>
                          <input
                            name={`title_${loc.id}`}
                            defaultValue={title}
                            className="mt-1 w-full rounded-lg border border-slate-800 bg-slate-900 px-3 py-1.5 text-xs text-slate-100 outline-none focus:border-slate-500"
                          />
                        </label>
                        <label className="mt-2 block">
                          <div className="text-[10px] font-semibold uppercase tracking-widest text-slate-600">
                            Что было (по строке)
                          </div>
                          <textarea
                            name={`was_${loc.id}`}
                            defaultValue={was}
                            rows={4}
                            className="mt-1 w-full rounded-lg border border-slate-800 bg-slate-900 px-3 py-1.5 text-xs text-slate-100 outline-none focus:border-slate-500"
                          />
                        </label>
                        <label className="mt-2 block">
                          <div className="text-[10px] font-semibold uppercase tracking-widest text-slate-600">
                            Что сделали (по строке)
                          </div>
                          <textarea
                            name={`done_${loc.id}`}
                            defaultValue={done}
                            rows={4}
                            className="mt-1 w-full rounded-lg border border-slate-800 bg-slate-900 px-3 py-1.5 text-xs text-slate-100 outline-none focus:border-slate-500"
                          />
                        </label>
                      </div>
                    );
                  })}
                </div>

                <div className="mt-3 flex justify-end">
                  <button
                    type="submit"
                    className="inline-flex items-center justify-center rounded-full bg-emerald-500 px-4 py-1.5 text-xs font-semibold text-white hover:bg-emerald-400"
                  >
                    Сохранить кейс
                  </button>
                </div>
                </form>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

