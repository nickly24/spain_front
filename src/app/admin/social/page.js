import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "../../../lib/prisma";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const dynamic = "force-dynamic";

async function saveSocial(formData) {
  "use server";
  const platform = formData.get("platform")?.toString();
  if (!platform) return;
  const url = (formData.get("url")?.toString() || "").trim();
  const sortOrder = Number(formData.get("sortOrder") || 0) || 0;
  const visible = formData.get("visible")?.toString() === "on";

  await prisma.socialLink.upsert({
    where: { platform },
    update: { url, sortOrder, visible },
    create: { platform, url, sortOrder, visible },
  });

  revalidatePath("/", "layout");
  redirect("/admin/social");
}

async function deleteSocial(formData) {
  "use server";
  const platform = formData.get("platform")?.toString();
  if (!platform) return;
  await prisma.socialLink.delete({ where: { platform } }).catch(() => null);
  revalidatePath("/", "layout");
  redirect("/admin/social");
}

const PLATFORMS = [
  { id: "facebook", label: "Facebook" },
  { id: "instagram", label: "Instagram" },
  { id: "youtube", label: "YouTube" },
];

export default async function AdminSocialPage() {
  const links = await prisma.socialLink.findMany({
    orderBy: [{ sortOrder: "asc" }, { id: "asc" }],
  });
  const byPlatform = new Map(links.map((l) => [l.platform, l]));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Соцсети</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Ссылки на иконки в верхней полосе сайта. Если выключить видимость или оставить пустой URL — иконка не показывается.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {PLATFORMS.map((p) => {
          const row = byPlatform.get(p.id) || null;
          return (
            <Card key={p.id}>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">{p.label}</CardTitle>
                <CardDescription className="text-xs">URL, порядок и видимость.</CardDescription>
              </CardHeader>

              <CardContent>
              <form action={saveSocial} className="space-y-3">
                <input type="hidden" name="platform" value={p.id} />
                <div className="space-y-2">
                  <Label>URL</Label>
                  <Input name="url" defaultValue={row?.url || ""} placeholder="https://..." />
                </div>

                <div className="flex flex-wrap items-end gap-3">
                  <div className="space-y-2">
                    <Label>Sort</Label>
                    <Input name="sortOrder" type="number" defaultValue={row?.sortOrder ?? 0} className="w-28" />
                  </div>

                  <label className="flex items-center gap-2 pb-1">
                    <input
                      type="checkbox"
                      name="visible"
                      defaultChecked={row?.visible ?? true}
                      className="accent-[hsl(var(--primary))]"
                    />
                    <span className="text-xs text-muted-foreground">Показывать</span>
                  </label>
                </div>

                <div className="flex items-center justify-between gap-2 pt-1">
                  <Button type="submit" size="sm">Сохранить</Button>
                </div>
              </form>

              <form action={deleteSocial} className="mt-2 flex justify-end">
                <input type="hidden" name="platform" value={p.id} />
                <Button type="submit" size="sm" variant="destructive">Удалить</Button>
              </form>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

