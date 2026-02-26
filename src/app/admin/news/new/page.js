import { redirect } from "next/navigation";
import { prisma } from "../../../../lib/prisma";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

async function createNews(formData) {
  "use server";

  const title = formData.get("title")?.toString() || "";
  const slug = formData.get("slug")?.toString() || "";
  const excerpt = formData.get("excerpt")?.toString() || "";
  const content = formData.get("content")?.toString() || "";
  const status = formData.get("status")?.toString() || "draft";
  const dateStr = formData.get("publishedAt")?.toString() || "";
  const publishedAt = dateStr ? new Date(dateStr) : null;

  const created = await prisma.newsPost.create({
    data: {
      title,
      slug,
      excerpt,
      content,
      status,
      publishedAt,
    },
  });

  redirect(`/admin/news/${created.id}`);
}

export default function AdminNewsCreatePage() {
  const today = new Date().toISOString().slice(0, 10);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Новая публикация</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Создание статьи для раздела «Новости и статьи».
          </p>
        </div>
      </div>

      <form action={createNews} className="space-y-6">
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
                  <Input name="title" />
                </div>
                <div className="space-y-2">
                  <Label>Slug (URL)</Label>
                  <Input name="slug" />
                </div>
                <div className="space-y-2">
                  <Label>Краткое описание (excerpt)</Label>
                  <Textarea name="excerpt" rows={3} />
                </div>
              </div>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Статус</Label>
                  <select
                    name="status"
                    defaultValue="draft"
                    className="h-10 w-full rounded-xl border border-input bg-background px-3 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <option value="draft">Черновик</option>
                    <option value="published">Опубликована</option>
                    <option value="archived">Архив</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label>Дата публикации</Label>
                  <Input name="publishedAt" type="date" defaultValue={today} />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Текст статьи</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea name="content" rows={12} />
          </CardContent>
        </Card>

        <div className="flex items-center justify-end gap-4">
          <Button type="submit">Создать публикацию</Button>
        </div>
      </form>
    </div>
  );
}

