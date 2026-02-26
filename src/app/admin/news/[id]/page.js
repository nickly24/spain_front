import { notFound, redirect } from "next/navigation";
import { prisma } from "../../../../lib/prisma";
import { Button } from "@/components/ui/button";
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

  await prisma.newsPost.update({
    where: { id },
    data: {
      title,
      slug,
      excerpt,
      content,
      status,
      publishedAt,
    },
  });

  redirect(`/admin/news/${id}`);
}

export default async function AdminNewsEditPage({ params }) {
  const resolvedParams = await Promise.resolve(params);
  const id = Number(resolvedParams?.id);
  if (!id) return notFound();

  const post = await prisma.newsPost.findUnique({ where: { id } });
  if (!post) return notFound();

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
            <CardTitle>Параметры</CardTitle>
            <CardDescription>Заголовок, URL и состояние публикации.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
              <div className="space-y-4 lg:col-span-2">
                <div className="space-y-2">
                  <Label>Заголовок</Label>
                  <Input name="title" defaultValue={post.title} />
                </div>
                <div className="space-y-2">
                  <Label>Slug (URL)</Label>
                  <Input name="slug" defaultValue={post.slug} />
                </div>
                <div className="space-y-2">
                  <Label>Краткое описание (excerpt)</Label>
                  <Textarea name="excerpt" rows={3} defaultValue={post.excerpt || ""} />
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
            <CardTitle>Текст статьи</CardTitle>
            <CardDescription>
              Текст хранится единым полем, абзацы разделяются пустой строкой. В следующей итерации можно заменить на полноценный редактор.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea name="content" rows={12} defaultValue={post.content || ""} />
          </CardContent>
        </Card>

        <div className="flex flex-col-reverse items-start justify-between gap-3 sm:flex-row sm:items-center">
          <Button asChild variant="link" className="px-0">
            <a href={`/news/${post.slug}`}>Открыть статью на сайте</a>
          </Button>
          <Button type="submit">Сохранить изменения</Button>
        </div>
      </form>
    </div>
  );
}

