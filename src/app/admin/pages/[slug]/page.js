import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { prisma } from "../../../../lib/prisma";
import { getPageFields } from "../fieldsConfig";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

async function savePage(formData) {
  "use server";

  const slug = formData.get("slug")?.toString() || "";
  if (!slug) return;

  const localeRaw = formData.get("locale")?.toString() || "ru";
  const locale = localeRaw === "en" || localeRaw === "es" ? localeRaw : "ru";

  const entries = Array.from(formData.entries());

  const content = formData.get("page_content")?.toString() || "";

  const trTitle = formData.get("tr_title")?.toString() || "";
  const trSeoTitle = formData.get("tr_seoTitle")?.toString() || "";
  const trSeoDescription = formData.get("tr_seoDescription")?.toString() || "";

  const fieldValues = entries
    .filter(([name]) => name.startsWith("field__"))
    .map(([name, value]) => {
      const key = name.slice("field__".length);
      return { key, value: value.toString() };
    });

  await prisma.$transaction(async (tx) => {
    // Базовое поле page.content держим как RU-fallback (чтобы не ломать старые фоллбеки).
    if (locale === "ru") {
      await tx.page.update({
        where: { slug },
        data: { content },
      });
    }

    // Локализуемый "общий текст": храним в pageContent отдельно по locale.
    await tx.pageContent.upsert({
      where: {
        pageSlug_key_locale: {
          pageSlug: slug,
          key: "__page_content__",
          locale,
        },
      },
      update: { value: content },
      create: { pageSlug: slug, key: "__page_content__", value: content, locale },
    });

    for (const { key, value } of fieldValues) {
      await tx.pageContent.upsert({
        where: {
          pageSlug_key_locale: {
            pageSlug: slug,
            key,
            locale,
          },
        },
        update: { value },
        create: { pageSlug: slug, key, value, locale },
      });
    }

    const pageRow = await tx.page.findUnique({ where: { slug } });
    if (pageRow) {
      const safeTitle = trTitle.trim() || pageRow.title;
      await tx.pageTranslation.upsert({
        where: {
          pageId_locale: { pageId: pageRow.id, locale },
        },
        update: {
          title: safeTitle,
          seoTitle: trSeoTitle.trim() || null,
          seoDescription: trSeoDescription.trim() || null,
        },
        create: {
          pageId: pageRow.id,
          locale,
          title: safeTitle,
          seoTitle: trSeoTitle.trim() || null,
          seoDescription: trSeoDescription.trim() || null,
        },
      });
    }
  });

  redirect(`/admin/pages/${slug}?lang=${locale}`);
}

export default async function AdminPageEditPage({ params, searchParams }) {
  const resolved = await Promise.resolve(params);
  const slug = resolved?.slug?.toString();
  if (!slug) return notFound();

  const langParam = (await Promise.resolve(searchParams))?.lang;
  const locale = langParam === "en" || langParam === "es" || langParam === "ru" ? langParam : "ru";

  const page = await prisma.page.findUnique({
    where: { slug },
    include: { translations: { where: { locale }, take: 1 } },
  });
  if (!page) return notFound();

  const pageTr = page.translations?.[0];

  const fields = getPageFields(slug);
  const snippets = await prisma.pageContent.findMany({
    where: { pageSlug: slug, locale },
  });
  const valueByKey = new Map(snippets.map((s) => [s.key, s.value]));

  const prettyPath = slug === "home" ? `/${locale}` : `/${locale}/${slug}`;
  const locales = ["ru", "en", "es"];
  const localeLabel = locale === "ru" ? "RU" : locale === "en" ? "EN" : "ES";
  const localizedContent = valueByKey.get("__page_content__") || (locale === "ru" ? page.content || "" : "");

  return (
    <div className="-mx-4 -my-4 space-y-6 px-4 py-4 md:-mx-8 md:-my-6 md:px-8 md:py-6">
      <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-xl font-semibold tracking-tight md:text-2xl">
            Страница «{page.title}»
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Слева — живая копия сайта, справа — поля. Настраивай текст блоков,
            как в конструкторе.
          </p>
        </div>
        <div className="flex gap-2">
          <div className="hidden items-center gap-1 rounded-full border border-border bg-muted/30 px-2 py-1 text-xs font-semibold text-muted-foreground md:inline-flex">
            {locales.map((l) => (
              <Link
                key={l}
                href={`/admin/pages/${slug}?lang=${l}`}
                className={`rounded-full px-3 py-1 text-[11px] font-semibold ${
                  l === locale
                    ? "bg-primary text-primary-foreground"
                    : "text-foreground/80 hover:bg-muted"
                }`}
              >
                {l.toUpperCase()}
              </Link>
            ))}
          </div>
          <Button asChild variant="outline" className="hidden md:inline-flex">
            <a href={prettyPath} target="_blank" rel="noreferrer">
              Открыть страницу
            </a>
          </Button>
          <Button asChild variant="outline">
            <Link href="/admin/pages">← Назад к списку</Link>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-7 flex justify-center">
          <Card className="w-full max-w-[1120px] overflow-hidden rounded-3xl">
            <div className="flex items-center justify-between border-b border-border bg-muted/30 px-4 py-2 text-[11px] text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-border" />
                <span className="h-2.5 w-2.5 rounded-full bg-border" />
                <span className="h-2.5 w-2.5 rounded-full bg-border" />
              </div>
              <div className="truncate px-3 text-xs text-muted-foreground">
                https://mggroup.es{prettyPath === "/" ? "" : prettyPath}
              </div>
              <div className="text-[10px] uppercase tracking-widest text-muted-foreground">
                Превью ({localeLabel})
              </div>
            </div>
            <div className="aspect-1440/900 bg-background">
              <iframe
                src={prettyPath}
                title={page.title}
                className="h-full w-full border-0"
              />
            </div>
          </Card>
        </div>

        <form
          action={savePage}
          className="lg:col-span-5 flex"
        >
          <input type="hidden" name="slug" defaultValue={page.slug} />
          <input type="hidden" name="locale" defaultValue={locale} />

          <Card className="flex h-full w-full flex-col rounded-3xl">
            <CardHeader className="flex-row items-start justify-between gap-3 space-y-0 border-b border-border py-4">
              <div>
                <CardTitle className="text-base">Тексты страницы</CardTitle>
                <CardDescription className="text-xs">{prettyPath}</CardDescription>
              </div>
            </CardHeader>

            <CardContent className="flex-1 space-y-4 overflow-y-auto p-4">
              <div className="space-y-3 rounded-2xl border border-primary/20 bg-primary/5 p-4">
                <div className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                  SEO и оглавление ({localeLabel})
                </div>
                <div className="space-y-2">
                  <Label className="text-[11px]">Заголовок страницы</Label>
                  <Input
                    name="tr_title"
                    defaultValue={pageTr?.title ?? page.title}
                    placeholder="Заголовок для этого языка"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-[11px]">SEO title</Label>
                  <Input
                    name="tr_seoTitle"
                    defaultValue={pageTr?.seoTitle ?? page.seoTitle ?? ""}
                    placeholder="Мета title для поисковиков"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-[11px]">SEO description</Label>
                  <Textarea
                    name="tr_seoDescription"
                    defaultValue={pageTr?.seoDescription ?? page.seoDescription ?? ""}
                    rows={3}
                    placeholder="Описание для SEO и превью ссылок (og:description)"
                  />
                </div>
              </div>

              {fields.length > 0 ? (
                fields.map((field) => {
                  const id = `field__${field.key}`;
                  const value = valueByKey.get(field.key) || "";
                  const isLong = field.type === "long";
                  return (
                    <div
                      key={field.key}
                      className="rounded-2xl border border-border bg-muted/30 p-4"
                    >
                      <Label
                        htmlFor={id}
                        className="text-[11px] uppercase tracking-widest text-muted-foreground"
                      >
                        {field.label}
                      </Label>
                      {field.hint ? (
                        <p className="mt-1 text-[11px] text-muted-foreground">
                          {field.hint}
                        </p>
                      ) : null}
                      {isLong ? (
                        <Textarea
                          id={id}
                          name={id}
                          defaultValue={value}
                          rows={5}
                          className="mt-2"
                        />
                      ) : (
                        <Input
                          id={id}
                          name={id}
                          defaultValue={value}
                          className="mt-2"
                        />
                      )}
                    </div>
                  );
                })
              ) : (
                <div className="rounded-2xl border border-dashed border-border bg-muted/30 p-4 text-sm text-muted-foreground">
                  Для этой страницы ещё не настроен список отдельных полей. Текст
                  ниже продолжает работать как общий блок.
                </div>
              )}

              <div className="space-y-2 rounded-2xl border border-dashed border-border bg-muted/30 p-4">
                <Label className="text-[11px] uppercase tracking-widest text-muted-foreground">
                  Общий текстовый блок страницы
                </Label>
                <p className="mt-1 text-[11px] text-muted-foreground">
                  Резервный текстовый блок для страниц, где пока нет разбивки на
                  отдельные поля. Можно использовать переносы строк.
                </p>
                <Textarea
                  name="page_content"
                  defaultValue={localizedContent}
                  rows={5}
                  className="mt-2"
                />
              </div>
            </CardContent>

            <div className="border-t border-border bg-background px-4 py-3">
              <div className="flex items-center justify-end gap-3">
                <Button type="submit">Сохранить изменения</Button>
              </div>
            </div>
          </Card>
        </form>
      </div>
    </div>
  );
}

