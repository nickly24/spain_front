import { notFound, redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "../../../../lib/prisma";
import { Button } from "@/components/ui/button";
import { DeleteButton } from "@/components/FormWithPending";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

async function saveNews(formData) {
  "use server";

  const id = Number(formData.get("id"));
  if (!id) return;

  const title = formData.get("title")?.toString() || "";
  const slug = formData.get("slug")?.toString() || "";
  const excerpt = formData.get("excerpt")?.toString() || "";
  const content = formData.get("content")?.toString() || "";
  const status = formData.get("status")?.toString() || "draft";
  const dateStr = formData.get("publishedAt")?.toString() || "";
  const publishedAt = dateStr ? new Date(dateStr) : null;

  const trEn = {
    title: formData.get("title_en")?.toString() || "",
    excerpt: formData.get("excerpt_en")?.toString() || "",
    content: formData.get("content_en")?.toString() || "",
  };
  const trEs = {
    title: formData.get("title_es")?.toString() || "",
    excerpt: formData.get("excerpt_es")?.toString() || "",
    content: formData.get("content_es")?.toString() || "",
  };

  await prisma.$transaction([
    prisma.newsPost.update({
      where: { id },
      data: { title, slug, excerpt, content, status, publishedAt },
    }),
    prisma.newsPostTranslation.upsert({
      where: { postId_locale: { postId: id, locale: "en" } },
      update: { title: trEn.title, excerpt: trEn.excerpt, content: trEn.content },
      create: { postId: id, locale: "en", title: trEn.title || title, excerpt: trEn.excerpt || excerpt, content: trEn.content || content },
    }),
    prisma.newsPostTranslation.upsert({
      where: { postId_locale: { postId: id, locale: "es" } },
      update: { title: trEs.title, excerpt: trEs.excerpt, content: trEs.content },
      create: { postId: id, locale: "es", title: trEs.title || title, excerpt: trEs.excerpt || excerpt, content: trEs.content || content },
    }),
  ]);

  revalidatePath("/", "layout");
  redirect(`/admin/news/${id}?message=${encodeURIComponent("Публикация сохранена")}&type=success`);
}

async function deleteNews(formData) {
  "use server";

  const id = Number(formData.get("id"));
  if (!id) return;

  let success = false;
  try {
    await prisma.$transaction(async (tx) => {
      await tx.newsPostTranslation.deleteMany({ where: { postId: id } });
      await tx.newsPost.delete({ where: { id } });
    });
    success = true;
  } catch (error) {
    console.error("Failed to delete news:", error);
  }

  if (!success) {
    redirect(`/admin/news/${id}?message=${encodeURIComponent("Ошибка при удалении публикации")}&type=error`);
  }

  revalidatePath("/", "layout");
  redirect("/admin/news");
}

export default async function AdminNewsEditPage({ params }) {
  const resolvedParams = await Promise.resolve(params);
  const id = Number(resolvedParams?.id);
  if (!id) return notFound();

  const post = await prisma.newsPost.findUnique({
    where: { id },
    include: { translations: true },
  });
  if (!post) return notFound();

  const trEn = post.translations?.find((t) => t.locale === "en") || null;
  const trEs = post.translations?.find((t) => t.locale === "es") || null;

  const dateValue = post.publishedAt
    ? new Date(post.publishedAt).toISOString().slice(0, 10)
    : "";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">
            Публикация «{post.title}»
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Редактирование статьи для раздела «Новости и статьи».
          </p>
        </div>
      </div>

      <form action={saveNews} className="space-y-6">
        <input type="hidden" name="id" defaultValue={post.id} />

        <Card>
          <CardHeader>
            <CardTitle>Общие параметры</CardTitle>
            <CardDescription>Slug (URL) и состояние публикации — общие для всех языков.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
              <div className="space-y-4 lg:col-span-2">
                <div className="space-y-2">
                  <Label>Slug (URL)</Label>
                  <Input name="slug" defaultValue={post.slug} />
                </div>
              </div>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Статус</Label>
                  <select
                    name="status"
                    defaultValue={post.status}
                    className="h-10 w-full rounded-xl border border-input bg-background px-3 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <option value="draft">Черновик</option>
                    <option value="published">Опубликована</option>
                    <option value="archived">Архив</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label>Дата публикации</Label>
                  <Input name="publishedAt" type="date" defaultValue={dateValue} />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Русский (RU)</CardTitle>
            <CardDescription>Заголовок и текст для русской версии.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Заголовок</Label>
              <Input name="title" defaultValue={post.title} />
            </div>
            <div className="space-y-2">
              <Label>Краткое описание (excerpt)</Label>
              <Textarea name="excerpt" rows={3} defaultValue={post.excerpt || ""} />
            </div>
            <div className="space-y-2">
              <Label>Текст статьи</Label>
              <Textarea name="content" rows={8} defaultValue={post.content || ""} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>English (EN)</CardTitle>
            <CardDescription>Заголовок и текст для английской версии.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Title</Label>
              <Input name="title_en" defaultValue={trEn?.title || ""} />
            </div>
            <div className="space-y-2">
              <Label>Excerpt</Label>
              <Textarea name="excerpt_en" rows={3} defaultValue={trEn?.excerpt || ""} />
            </div>
            <div className="space-y-2">
              <Label>Content</Label>
              <Textarea name="content_en" rows={8} defaultValue={trEn?.content || ""} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Español (ES)</CardTitle>
            <CardDescription>Заголовок и текст для испанской версии.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Título</Label>
              <Input name="title_es" defaultValue={trEs?.title || ""} />
            </div>
            <div className="space-y-2">
              <Label>Extracto</Label>
              <Textarea name="excerpt_es" rows={3} defaultValue={trEs?.excerpt || ""} />
            </div>
            <div className="space-y-2">
              <Label>Contenido</Label>
              <Textarea name="content_es" rows={8} defaultValue={trEs?.content || ""} />
            </div>
          </CardContent>
        </Card>

        <div className="flex flex-col-reverse items-start justify-between gap-3 sm:flex-row sm:items-center">
          <div className="flex items-center gap-3">
            <Button asChild variant="link" className="px-0">
              <a href={`/news/${post.slug}`}>Открыть статью на сайте</a>
            </Button>
          </div>
          <Button type="submit">Сохранить изменения</Button>
        </div>
      </form>

      <form action={deleteNews} className="flex justify-start">
        <input type="hidden" name="id" value={post.id} />
        <DeleteButton size="sm">Удалить публикацию</DeleteButton>
      </form>
    </div>
  );
}

