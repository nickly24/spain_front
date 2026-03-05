import path from "path";
import { promises as fs } from "fs";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import Image from "next/image";
import Link from "next/link";
import { prisma } from "../../../../lib/prisma";
import { Button } from "@/components/ui/button";
import { SubmitButton, DeleteButton } from "@/components/FormWithPending";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";

export const dynamic = "force-dynamic";

const LOCALES = [
  { id: "ru", label: "RU", name: "Русский" },
  { id: "en", label: "EN", name: "English" },
  { id: "es", label: "ES", name: "Español" },
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
  if (!file || typeof file === "string" || file.size === 0) return null;
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

async function deleteOldFile(url) {
  if (!url || !url.startsWith("/uploads/")) return;
  const uploadsDir = path.join(process.cwd(), "public");
  const abs = path.join(uploadsDir, url.replace(/^\/+/, ""));
  try {
    await fs.unlink(abs);
  } catch {
    // Игнорируем, если файл не найден
  }
}

async function createCase(formData) {
  "use server";

  const beforeFile = formData.get("beforeFile");
  const afterFile = formData.get("afterFile");
  
  if (!beforeFile || typeof beforeFile === "string" || !afterFile || typeof afterFile === "string") {
    redirect(`/admin/construction/cases?message=${encodeURIComponent("Необходимо загрузить оба фото")}&type=error`);
    return;
  }
  
  const beforeUrl = await saveUploadedFile(beforeFile, "case_new_before");
  const afterUrl = await saveUploadedFile(afterFile, "case_new_after");

  if (!beforeUrl || !afterUrl) {
    redirect(`/admin/construction/cases?message=${encodeURIComponent("Ошибка при загрузке фото")}&type=error`);
  }

  const byLocale = {};
  for (const loc of LOCALES) {
    byLocale[loc.id] = {
      title: (formData.get(`title_${loc.id}`)?.toString() || "").trim() || null,
      was: linesToJsonArray(formData.get(`was_${loc.id}`)?.toString() || ""),
      done: linesToJsonArray(formData.get(`done_${loc.id}`)?.toString() || ""),
    };
  }

  let createdId = null;
  try {
    const created = await prisma.constructionCase.create({
      data: {
        title: byLocale.ru.title || "Новый кейс",
        beforeUrl: beforeUrl,
        afterUrl: afterUrl,
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
    createdId = created.id;
  } catch (error) {
    console.error("Failed to create case:", error);
    redirect(`/admin/construction/cases?message=${encodeURIComponent("Ошибка при создании кейса")}&type=error`);
  }

  revalidatePath("/", "layout");
  redirect(`/admin/construction/cases?message=${encodeURIComponent("Кейс создан")}&type=success#case-${createdId}`);
}

async function saveCase(formData) {
  "use server";
  const id = Number(formData.get("id"));
  if (!id) return;

  const currentBeforeUrl = (formData.get("currentBeforeUrl")?.toString() || "").trim();
  const currentAfterUrl = (formData.get("currentAfterUrl")?.toString() || "").trim();
  const beforeFile = formData.get("beforeFile");
  const afterFile = formData.get("afterFile");
  
  let beforeUrl = currentBeforeUrl;
  let afterUrl = currentAfterUrl;

  if (beforeFile && typeof beforeFile !== "string" && beforeFile.size > 0) {
    const newUrl = await saveUploadedFile(beforeFile, `case_${id}_before`);
    if (newUrl) {
      await deleteOldFile(currentBeforeUrl);
      beforeUrl = newUrl;
    }
  }

  if (afterFile && typeof afterFile !== "string" && afterFile.size > 0) {
    const newUrl = await saveUploadedFile(afterFile, `case_${id}_after`);
    if (newUrl) {
      await deleteOldFile(currentAfterUrl);
      afterUrl = newUrl;
    }
  }

  const byLocale = {};
  for (const loc of LOCALES) {
    byLocale[loc.id] = {
      title: (formData.get(`title_${loc.id}`)?.toString() || "").trim() || null,
      was: linesToJsonArray(formData.get(`was_${loc.id}`)?.toString() || ""),
      done: linesToJsonArray(formData.get(`done_${loc.id}`)?.toString() || ""),
    };
  }

  let success = false;
  try {
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
    success = true;
  } catch (error) {
    console.error("Failed to save case:", error);
  }

  revalidatePath("/", "layout");
  redirect(
    `/admin/construction/cases?message=${encodeURIComponent(
      success ? "Кейс сохранён" : "Ошибка при сохранении кейса"
    )}&type=${success ? "success" : "error"}#case-${id}`
  );
}

async function deleteCase(formData) {
  "use server";
  const id = Number(formData.get("id"));
  if (!id) return;
  
  let success = false;
  try {
    const caseData = await prisma.constructionCase.findUnique({ where: { id } });
    if (caseData) {
      await deleteOldFile(caseData.beforeUrl);
      await deleteOldFile(caseData.afterUrl);
    }

    await prisma.constructionCase.delete({ where: { id } });
    success = true;
  } catch (error) {
    console.error("Failed to delete case:", error);
  }

  revalidatePath("/", "layout");
  redirect(
    `/admin/construction/cases?message=${encodeURIComponent(
      success ? "Кейс удалён" : "Ошибка при удалении кейса"
    )}&type=${success ? "success" : "error"}`
  );
}

export default async function AdminConstructionCasesPage() {
  const cases = await prisma.constructionCase.findMany({
    orderBy: { id: "desc" },
    include: { translations: true },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Кейсы до/после</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Портфолио выполненных работ с фотографиями "до" и "после".
          </p>
        </div>
        <Button asChild variant="outline" size="sm">
          <Link href="/admin/construction">← Этапы и услуги</Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Добавить новый кейс</CardTitle>
          <CardDescription>
            Загрузите фотографии "до" и "после", добавьте описание на всех языках.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={createCase} className="space-y-6">
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              <div className="space-y-3">
                <Label className="text-sm font-semibold">Фото "До"</Label>
                <div className="flex aspect-4/3 items-center justify-center rounded-xl border-2 border-dashed border-border bg-muted/30">
                  <div className="text-center text-muted-foreground">
                    <svg className="mx-auto h-16 w-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <div className="mt-3 text-sm font-medium">Загрузите фото "до"</div>
                  </div>
                </div>
                <input
                  type="file"
                  name="beforeFile"
                  accept="image/*"
                  required
                  className="block w-full text-sm file:mr-4 file:rounded-full file:border-0 file:bg-primary file:px-4 file:py-2 file:text-sm file:font-semibold file:text-primary-foreground hover:file:bg-primary/90"
                />
              </div>

              <div className="space-y-3">
                <Label className="text-sm font-semibold">Фото "После"</Label>
                <div className="flex aspect-4/3 items-center justify-center rounded-xl border-2 border-dashed border-border bg-muted/30">
                  <div className="text-center text-muted-foreground">
                    <svg className="mx-auto h-16 w-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <div className="mt-3 text-sm font-medium">Загрузите фото "после"</div>
                  </div>
                </div>
                <input
                  type="file"
                  name="afterFile"
                  accept="image/*"
                  required
                  className="block w-full text-sm file:mr-4 file:rounded-full file:border-0 file:bg-primary file:px-4 file:py-2 file:text-sm file:font-semibold file:text-primary-foreground hover:file:bg-primary/90"
                />
              </div>
            </div>

            <Separator />

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
              {LOCALES.map((loc) => (
                <div key={loc.id} className="space-y-4 rounded-xl border border-border bg-muted/30 p-4">
                  <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    {loc.name}
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs">Заголовок</Label>
                    <Input name={`title_${loc.id}`} placeholder="Название проекта" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs">Что было (по строке)</Label>
                    <Textarea
                      name={`was_${loc.id}`}
                      rows={4}
                      placeholder="Каждая строка — отдельный пункт"
                      className="text-xs"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs">Что сделали (по строке)</Label>
                    <Textarea
                      name={`done_${loc.id}`}
                      rows={4}
                      placeholder="Каждая строка — отдельный пункт"
                      className="text-xs"
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-end">
              <SubmitButton size="lg">Создать кейс</SubmitButton>
            </div>
          </form>
        </CardContent>
      </Card>

      <div className="space-y-4">
        {cases.map((c) => {
          const trRu = pickTr(c.translations, "ru");
          const trEn = pickTr(c.translations, "en");
          const trEs = pickTr(c.translations, "es");
          
          return (
            <Card key={c.id} id={`case-${c.id}`}>
              <CardHeader>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <CardTitle className="text-lg">Кейс #{c.id}</CardTitle>
                    <CardDescription>{c.title || "Без названия"}</CardDescription>
                  </div>
                  <form action={deleteCase}>
                    <input type="hidden" name="id" defaultValue={c.id} />
                    <DeleteButton size="sm">Удалить кейс</DeleteButton>
                  </form>
                </div>
              </CardHeader>
              <CardContent>
                <form action={saveCase} className="space-y-6">
                  <input type="hidden" name="id" defaultValue={c.id} />
                  <input type="hidden" name="currentBeforeUrl" defaultValue={c.beforeUrl || ""} />
                  <input type="hidden" name="currentAfterUrl" defaultValue={c.afterUrl || ""} />

                  <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                    <div className="space-y-3">
                      <Label className="text-sm font-semibold">Фото "До"</Label>
                      {c.beforeUrl ? (
                        <div className="relative aspect-4/3 overflow-hidden rounded-xl border border-border bg-muted">
                          <Image
                            src={c.beforeUrl}
                            alt="До"
                            fill
                            className="object-cover"
                            sizes="(max-width: 1024px) 100vw, 50vw"
                          />
                          <div className="absolute left-3 top-3">
                            <div className="rounded-lg bg-slate-900/80 px-3 py-1.5 text-sm font-semibold text-white backdrop-blur-sm">
                              ДО
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="flex aspect-4/3 items-center justify-center rounded-xl border-2 border-dashed border-border bg-muted/30">
                          <div className="text-center text-muted-foreground">
                            <svg className="mx-auto h-16 w-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <div className="mt-2 text-sm">Нет фото</div>
                          </div>
                        </div>
                      )}
                      <input
                        type="file"
                        name="beforeFile"
                        accept="image/*"
                        className="block w-full text-sm file:mr-4 file:rounded-full file:border-0 file:bg-primary file:px-4 file:py-2 file:text-sm file:font-semibold file:text-primary-foreground hover:file:bg-primary/90"
                      />
                      <p className="text-xs text-muted-foreground">
                        {c.beforeUrl ? "Загрузите файл, чтобы заменить текущее фото" : "Загрузите фото"}
                      </p>
                    </div>

                    <div className="space-y-3">
                      <Label className="text-sm font-semibold">Фото "После"</Label>
                      {c.afterUrl ? (
                        <div className="relative aspect-4/3 overflow-hidden rounded-xl border border-border bg-muted">
                          <Image
                            src={c.afterUrl}
                            alt="После"
                            fill
                            className="object-cover"
                            sizes="(max-width: 1024px) 100vw, 50vw"
                          />
                          <div className="absolute left-3 top-3">
                            <div className="rounded-lg bg-emerald-600/90 px-3 py-1.5 text-sm font-semibold text-white backdrop-blur-sm">
                              ПОСЛЕ
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="flex aspect-4/3 items-center justify-center rounded-xl border-2 border-dashed border-border bg-muted/30">
                          <div className="text-center text-muted-foreground">
                            <svg className="mx-auto h-16 w-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <div className="mt-2 text-sm">Нет фото</div>
                          </div>
                        </div>
                      )}
                      <input
                        type="file"
                        name="afterFile"
                        accept="image/*"
                        className="block w-full text-sm file:mr-4 file:rounded-full file:border-0 file:bg-primary file:px-4 file:py-2 file:text-sm file:font-semibold file:text-primary-foreground hover:file:bg-primary/90"
                      />
                      <p className="text-xs text-muted-foreground">
                        {c.afterUrl ? "Загрузите файл, чтобы заменить текущее фото" : "Загрузите фото"}
                      </p>
                    </div>
                  </div>

                  <Separator />

                  <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                    {LOCALES.map((loc) => {
                      const tr = pickTr(c.translations, loc.id) || {};
                      const title = tr.title || (loc.id === "ru" ? c.title : "");
                      const was = jsonArrayToLines(tr.was ?? (loc.id === "ru" ? c.was : null));
                      const done = jsonArrayToLines(tr.done ?? (loc.id === "ru" ? c.done : null));
                      
                      return (
                        <div key={loc.id} className="space-y-4 rounded-xl border border-border bg-muted/30 p-4">
                          <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                            {loc.name}
                          </div>
                          <div className="space-y-2">
                            <Label className="text-xs">Заголовок</Label>
                            <Input
                              name={`title_${loc.id}`}
                              defaultValue={title}
                              placeholder="Название проекта"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label className="text-xs">Что было (по строке)</Label>
                            <Textarea
                              name={`was_${loc.id}`}
                              defaultValue={was}
                              rows={4}
                              placeholder="Каждая строка — отдельный пункт"
                              className="text-xs"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label className="text-xs">Что сделали (по строке)</Label>
                            <Textarea
                              name={`done_${loc.id}`}
                              defaultValue={done}
                              rows={4}
                              placeholder="Каждая строка — отдельный пункт"
                              className="text-xs"
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="flex justify-end">
                    <SubmitButton size="lg">💾 Сохранить кейс</SubmitButton>
                  </div>
                </form>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {!cases.length && (
        <Card>
          <CardContent className="py-12">
            <div className="text-center text-muted-foreground">
              <svg className="mx-auto h-16 w-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <p className="mt-4 text-sm font-medium">Пока нет кейсов</p>
              <p className="mt-1 text-xs">Создайте первый кейс, заполнив форму выше</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
