import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
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

  const created = await prisma.newsPost.create({
    data: {
      title,
      slug,
      excerpt,
      content,
      status,
      publishedAt,
      translations: {
        create: [
          { locale: "en", title: trEn.title || title, excerpt: trEn.excerpt || excerpt, content: trEn.content || content },
          { locale: "es", title: trEs.title || title, excerpt: trEs.excerpt || excerpt, content: trEs.content || content },
        ],
      },
    },
  });

  revalidatePath("/", "layout");
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
            <CardTitle>Общие параметры</CardTitle>
            <CardDescription>Slug (URL) и состояние публикации — общие для всех языков.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
              <div className="space-y-4 lg:col-span-2">
                <div className="space-y-2">
                  <Label>Slug (URL)</Label>
                  <Input name="slug" placeholder="novaya-statya" />
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
            <CardTitle>Русский (RU)</CardTitle>
            <CardDescription>Заголовок и текст для русской версии.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Заголовок</Label>
              <Input name="title" />
            </div>
            <div className="space-y-2">
              <Label>Краткое описание (excerpt)</Label>
              <Textarea name="excerpt" rows={3} />
            </div>
            <div className="space-y-2">
              <Label>Текст статьи</Label>
              <Textarea name="content" rows={8} />
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
              <Input name="title_en" placeholder="Article title in English" />
            </div>
            <div className="space-y-2">
              <Label>Excerpt</Label>
              <Textarea name="excerpt_en" rows={3} placeholder="Short description in English" />
            </div>
            <div className="space-y-2">
              <Label>Content</Label>
              <Textarea name="content_en" rows={8} placeholder="Article text in English" />
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
              <Input name="title_es" placeholder="Título del artículo en español" />
            </div>
            <div className="space-y-2">
              <Label>Extracto</Label>
              <Textarea name="excerpt_es" rows={3} placeholder="Descripción breve en español" />
            </div>
            <div className="space-y-2">
              <Label>Contenido</Label>
              <Textarea name="content_es" rows={8} placeholder="Texto del artículo en español" />
            </div>
          </CardContent>
        </Card>

        <div className="flex items-center justify-end gap-4">
          <Button type="submit">Создать публикацию</Button>
        </div>
      </form>
    </div>
  );
}

