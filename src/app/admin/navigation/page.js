import { prisma } from "../../../lib/prisma";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const dynamic = "force-dynamic";

export default async function AdminNavigationPage() {
  const links = await prisma.navigationLink.findMany({
    orderBy: [{ location: "asc" }, { sortOrder: "asc" }],
  });

  const groups = links.reduce((acc, link) => {
    const key = link.location;
    if (!acc[key]) acc[key] = [];
    acc[key].push(link);
    return acc;
  }, /** @type {Record<string, typeof links>} */ ({}));

  const order = ["header", "topbar", "footer"];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Навигация</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Текущая структура меню в шапке, верхней полосе и подвале. Редактирование
          и сортировка могут быть добавлены отдельной итерацией.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {order.map((loc) => {
          const items = groups[loc] || [];
          const title =
            loc === "header"
              ? "Шапка (главное меню)"
              : loc === "topbar"
              ? "Верхняя полоса"
              : "Подвал";
          return (
            <Card key={loc}>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">{title}</CardTitle>
                <CardDescription className="text-xs">Ссылок: {items.length}</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-1 text-sm">
                  {items.map((l) => (
                    <li key={l.id} className="flex flex-wrap gap-x-2">
                      <span className="font-semibold">{l.label}</span>
                      <span className="text-xs text-muted-foreground">{l.href}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

