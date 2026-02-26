import { prisma } from "../../lib/prisma";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default async function AdminDashboardPage() {
  const [propertiesCount, saleCount, rentCount, newsCount] = await Promise.all([
    prisma.property.count(),
    prisma.property.count({ where: { listingType: "sale" } }),
    prisma.property.count({ where: { listingType: "rent" } }),
    prisma.newsPost.count(),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Дашборд</h1>
        <p className="mt-1 text-sm text-muted-foreground">Краткий обзор объектов и контента на сайте.</p>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card>
          <CardHeader className="pb-3">
            <CardDescription className="text-[11px] font-semibold uppercase tracking-widest">
              Объекты
            </CardDescription>
            <CardTitle className="text-3xl">{propertiesCount}</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-xs text-muted-foreground">
              Продажа: {saleCount} • Аренда: {rentCount}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription className="text-[11px] font-semibold uppercase tracking-widest">
              Новости и статьи
            </CardDescription>
            <CardTitle className="text-3xl">{newsCount}</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-xs text-muted-foreground">Публикации для раздела «Новости и статьи».</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription className="text-[11px] font-semibold uppercase tracking-widest">
              Быстрые действия
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li>— Открыть каталог объектов</li>
              <li>— Добавить новость или статью</li>
              <li>— Обновить телефоны и контакты</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

