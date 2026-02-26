import Link from "next/link";
import { prisma } from "../../../lib/prisma";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export const dynamic = "force-dynamic";

export default async function AdminPagesPage() {
  const [pages, heroes] = await Promise.all([
    prisma.page.findMany({ orderBy: { slug: "asc" } }),
    prisma.heroBanner.findMany({ orderBy: { pageSlug: "asc" } }),
  ]);

  const heroBySlug = new Map(heroes.map((h) => [h.pageSlug, h]));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Страницы и баннеры</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Здесь можно открыть страницу для редактирования текста и посмотреть,
          какой hero‑баннер к ней привязан.
        </p>
      </div>

      <Card className="overflow-hidden">
        <CardHeader className="border-b border-border py-4">
          <CardTitle className="text-base">Список страниц</CardTitle>
          <CardDescription className="text-xs">Всего: {pages.length}</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="sticky top-0 bg-card">
              <TableRow>
                <TableHead>Slug</TableHead>
                <TableHead>Название</TableHead>
                <TableHead>Hero‑баннер</TableHead>
                <TableHead className="text-right">Действия</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pages.map((p) => {
                const hero = heroBySlug.get(p.slug);
                return (
                  <TableRow key={p.id}>
                    <TableCell className="text-xs text-muted-foreground">{p.slug}</TableCell>
                    <TableCell className="whitespace-normal font-semibold">{p.title}</TableCell>
                    <TableCell className="text-xs text-muted-foreground whitespace-normal">
                      {hero ? hero.imageUrl : "—"}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button asChild size="sm" variant="outline">
                        <Link href={`/admin/pages/${p.slug}`}>Редактировать текст</Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

