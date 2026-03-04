import Link from "next/link";
import Image from "next/image";
import { redirect } from "next/navigation";
import { prisma } from "../../../lib/prisma";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trash2 } from "lucide-react";

export const dynamic = "force-dynamic";

async function deleteProperty(formData) {
  "use server";

  const id = Number(formData.get("id"));
  if (!id) return;

  await prisma.propertyImage.deleteMany({ where: { propertyId: id } });
  await prisma.property.delete({ where: { id } });

  redirect("/admin/properties");
}

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
      include: {
        images: {
          where: { isMain: true },
          take: 1,
        },
      },
      orderBy: [{ sortOrder: "desc" }, { id: "asc" }],
    }),
    prisma.property.findMany({
      where: { listingType: "rent" },
      include: {
        images: {
          where: { isMain: true },
          take: 1,
        },
      },
      orderBy: [{ sortOrder: "desc" }, { id: "asc" }],
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
        <div className="grid grid-cols-1 gap-4 p-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((p) => {
            const mainImage = p.images?.[0];
            return (
              <div
                key={p.id}
                className="group relative overflow-hidden rounded-2xl border border-border bg-card transition-all hover:border-primary/30 hover:shadow-lg"
              >
                <form action={deleteProperty} className="absolute left-2 top-2 z-10">
                  <input type="hidden" name="id" value={p.id} />
                  <Button
                    type="submit"
                    variant="destructive"
                    size="icon"
                    className="h-8 w-8 rounded-full opacity-80 shadow-lg hover:opacity-100"
                    title="Удалить объект"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </form>
                <Link href={`/admin/properties/${p.id}`} className="block">
                  <div className="relative aspect-4/3 overflow-hidden bg-muted">
                    {mainImage?.url ? (
                      <Image
                        src={mainImage.url}
                        alt={mainImage.alt || p.title}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-muted-foreground">
                        <svg className="h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                    )}
                    <div className="absolute right-2 top-2">
                      <Badge
                        variant={
                          p.status === "published"
                            ? "default"
                            : p.status === "draft"
                            ? "secondary"
                            : "outline"
                        }
                        className="shadow-sm"
                      >
                        {p.status === "published"
                          ? "Опубликован"
                          : p.status === "draft"
                          ? "Черновик"
                          : "Архив"}
                      </Badge>
                    </div>
                    <div className="absolute bottom-2 left-2">
                      <div className="rounded-md bg-black/60 px-2 py-1 text-xs font-mono text-white backdrop-blur-sm">
                        ID: {p.id}
                      </div>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-foreground line-clamp-2 group-hover:text-primary">
                      {p.title}
                    </h3>
                    <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
                      <span>{p.city}</span>
                      <span>•</span>
                      <span>{p.areaM2} м²</span>
                      <span>•</span>
                      <span>{p.bedrooms === 0 ? "Студия" : `${p.bedrooms} сп.`}</span>
                    </div>
                    <div className="mt-3 flex items-center justify-between">
                      <div className="text-lg font-bold text-primary">
                        {p.listingType === "sale" && p.priceEur
                          ? `€${formatMoney(p.priceEur)}`
                          : null}
                        {p.listingType === "rent" && p.rentEurPerMonth
                          ? `€${formatMoney(p.rentEurPerMonth)}/мес`
                          : null}
                      </div>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <span title="Просмотры">👁 {p.views}</span>
                        <span title="Рейтинг">⭐ {p.rating?.toFixed(1)}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Объекты</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Карточки объектов с фотографиями. Нажмите на карточку, чтобы редактировать.
        </p>
      </div>

      <div className="space-y-6">
        {renderTable(sale, "Продажа")}
        {renderTable(rent, "Аренда")}
      </div>
    </div>
  );
}


