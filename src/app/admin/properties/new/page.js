import { redirect } from "next/navigation";
import { prisma } from "../../../../lib/prisma";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

async function createProperty(formData) {
  "use server";

  const title = formData.get("title")?.toString() || "";
  const slug = formData.get("slug")?.toString() || "";
  const city = formData.get("city")?.toString() || "";
  const listingType = formData.get("listingType")?.toString() === "rent" ? "rent" : "sale";
  const bedrooms = Number(formData.get("bedrooms") || 0);
  const areaM2 = Number(formData.get("areaM2") || 0);
  const priceEur =
    listingType === "sale" ? Number(formData.get("priceEur") || 0) || null : null;
  const rentEurPerMonth =
    listingType === "rent" ? Number(formData.get("rentEurPerMonth") || 0) || null : null;
  const description = formData.get("description")?.toString() || "";

  const created = await prisma.property.create({
    data: {
      title,
      slug,
      city,
      listingType,
      bedrooms,
      areaM2,
      priceEur,
      rentEurPerMonth,
      description,
      status: "draft",
      views: 0,
      rating: 0,
    },
  });

  redirect(`/admin/properties/${created.id}`);
}

export default function AdminPropertyCreatePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Новый объект</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Создание объекта для продажи или аренды. После сохранения можно будет
          донастроить остальные поля.
        </p>
      </div>

      <form action={createProperty} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Базовые данные</CardTitle>
            <CardDescription>Можно заполнить минимально, остальное — после создания.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Заголовок</Label>
                  <Input name="title" />
                </div>
                <div className="space-y-2">
                  <Label>Slug (URL)</Label>
                  <Input name="slug" />
                </div>
                <div className="space-y-2">
                  <Label>Город</Label>
                  <Input name="city" />
                </div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <div className="space-y-2">
                    <Label>Формат</Label>
                    <select
                      name="listingType"
                      defaultValue="sale"
                      className="h-10 w-full rounded-xl border border-input bg-background px-3 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                      <option value="sale">Продажа</option>
                      <option value="rent">Аренда</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label>Спальни</Label>
                    <Input name="bedrooms" type="number" defaultValue={0} />
                  </div>
                  <div className="space-y-2">
                    <Label>Площадь, м²</Label>
                    <Input name="areaM2" type="number" defaultValue={0} />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Цена, €</Label>
                    <Input name="priceEur" type="number" />
                  </div>
                  <div className="space-y-2">
                    <Label>Аренда, €/мес</Label>
                    <Input name="rentEurPerMonth" type="number" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Описание</Label>
                  <Textarea name="description" rows={6} />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex items-center justify-end">
          <Button type="submit">Создать объект</Button>
        </div>
      </form>
    </div>
  );
}

