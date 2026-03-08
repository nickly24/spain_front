import Link from "next/link";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "../../../lib/prisma";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Trash2 } from "lucide-react";

export const dynamic = "force-dynamic";

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
    redirect(`/admin/news?message=${encodeURIComponent("Ошибка при удалении публикации")}&type=error`);
  }

  revalidatePath("/", "layout");
  redirect("/admin/news");
}

export default async function AdminNewsPage() {
  const posts = await prisma.newsPost.findMany({
    orderBy: { publishedAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Новости и статьи</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Управление публикациями раздела «Новости и статьи».
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/news/new">Добавить публикацию</Link>
        </Button>
      </div>

      <Card className="overflow-hidden">
        <CardHeader className="border-b border-border py-4">
          <CardTitle className="text-base">Список публикаций</CardTitle>
          <CardDescription className="text-xs">Всего: {posts.length}</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="sticky top-0 bg-card">
              <TableRow>
                <TableHead>Заголовок</TableHead>
                <TableHead>Slug</TableHead>
                <TableHead>Дата</TableHead>
                <TableHead>Статус</TableHead>
                <TableHead className="w-12" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {posts.map((p) => (
                <TableRow key={p.id}>
                  <TableCell className="whitespace-normal">
                    <Link
                      href={`/admin/news/${p.id}`}
                      className="font-semibold underline-offset-2 hover:underline"
                    >
                      {p.title}
                    </Link>
                    {p.excerpt ? (
                      <div className="mt-1 line-clamp-2 text-xs text-muted-foreground">
                        {p.excerpt}
                      </div>
                    ) : null}
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">{p.slug}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {p.publishedAt ? new Date(p.publishedAt).toLocaleDateString("ru-RU") : "—"}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        p.status === "published"
                          ? "default"
                          : p.status === "draft"
                          ? "secondary"
                          : "muted"
                      }
                    >
                      {p.status === "published"
                        ? "Опубликована"
                        : p.status === "draft"
                        ? "Черновик"
                        : "Архив"}
                    </Badge>
                  </TableCell>
                  <TableCell className="w-12">
                    <form action={deleteNews}>
                      <input type="hidden" name="id" value={p.id} />
                      <Button
                        type="submit"
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                        title="Удалить публикацию"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </form>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

