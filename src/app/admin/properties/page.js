import Link from "next/link";
import { prisma } from "../../../lib/prisma";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

export const dynamic = "force-dynamic";

function formatMoney(value) {
  if (!value) return "";
  try {
    return value.toLocaleString("ru-RU");
  } catch {
    return String(value);
  }
}

export default async function AdminPropertiesPage() {
  const [sale, rent] = await Promise.all([
    prisma.property.findMany({
      where: { listingType: "sale" },
      orderBy: { id: "asc" },
    }),
    prisma.property.findMany({
      where: { listingType: "rent" },
      orderBy: { id: "asc" },
    }),
  ]);

  const renderTable = (items, modeLabel) => (
    <Card className="overflow-hidden">
      <CardHeader className="flex-row items-center justify-between gap-3 space-y-0 border-b border-border py-4">
        <div>
          <CardTitle className="text-base">{modeLabel}</CardTitle>
          <CardDescription className="text-xs">
            {items.length ? `Всего: ${items.length}` : "Пока нет объектов"}
          </CardDescription>
        </div>
        <Button asChild>
          <Link href="/admin/properties/new">Создать объект</Link>
        </Button>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader className="sticky top-0 bg-card">
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Заголовок</TableHead>
              <TableHead>Город</TableHead>
              <TableHead>Площадь</TableHead>
              <TableHead>Цена / аренда</TableHead>
              <TableHead>Просмотры</TableHead>
              <TableHead>Рейтинг</TableHead>
              <TableHead>Статус</TableHead>
              <TableHead className="text-right">Действия</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((p) => (
              <TableRow key={p.id}>
                <TableCell className="text-xs font-mono text-muted-foreground">
                  {p.id}
                </TableCell>
                <TableCell className="whitespace-normal">
                  <div className="font-semibold">{p.title}</div>
                  <div className="text-xs text-muted-foreground">{p.slug}</div>
                </TableCell>
                <TableCell className="whitespace-normal">{p.city}</TableCell>
                <TableCell className="text-xs text-muted-foreground">
                  {p.areaM2} м² • {p.bedrooms === 0 ? "Студия" : `${p.bedrooms} сп.`}
                </TableCell>
                <TableCell className="text-xs text-muted-foreground">
                  {p.listingType === "sale" && p.priceEur
                    ? `€ ${formatMoney(p.priceEur)}`
                    : null}
                  {p.listingType === "rent" && p.rentEurPerMonth
                    ? `€ ${formatMoney(p.rentEurPerMonth)} / мес`
                    : null}
                </TableCell>
                <TableCell className="text-xs text-muted-foreground">
                  {p.views}
                </TableCell>
                <TableCell className="text-xs text-muted-foreground">
                  {p.rating?.toFixed(1)}
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
                      ? "Опубликован"
                      : p.status === "draft"
                      ? "Черновик"
                      : "Архив"}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Button asChild size="sm" variant="outline">
                    <Link href={`/admin/properties/${p.id}`}>Редактировать</Link>
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Объекты</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Отдельные списки по продаже и аренде. Нажмите «Редактировать», чтобы изменить карточку.
        </p>
      </div>

      <div className="space-y-6">
        {renderTable(sale, "Продажа")}
        {renderTable(rent, "Аренда")}
      </div>
    </div>
  );
}


