import { prisma } from "../../../lib/prisma";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const dynamic = "force-dynamic";

async function updateHeroImage(formData) {
  "use server";

  const pageSlug = formData.get("pageSlug")?.toString() || "";
  const imageUrl = formData.get("imageUrl")?.toString() || "";

  if (!pageSlug || !imageUrl) return;

  await prisma.heroBanner.upsert({
    where: { pageSlug },
    update: { imageUrl },
    create: { pageSlug, imageUrl },
  });
}

export default async function AdminMediaPage() {
  const heroes = await prisma.heroBanner.findMany({
    orderBy: { pageSlug: "asc" },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Медиа и баннеры</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Привязка загруженных картинок к hero‑баннерам страниц. Загрузка файлов
          происходит в разделённом API‑ендпоинте, который сохраняет файлы в
          папке <code className="rounded bg-slate-800 px-1 py-0.5">public/uploads</code>.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {heroes.map((h) => (
          <form
            key={h.id}
            action={updateHeroImage}
            className="space-y-3 rounded-2xl border border-border bg-card p-5 shadow-soft"
          >
            <input type="hidden" name="pageSlug" defaultValue={h.pageSlug} />
            <div className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              {h.pageSlug}
            </div>
            <div className="text-xs text-muted-foreground">
              Текущий URL:{" "}
              <span className="font-mono text-[11px] text-foreground">
                {h.imageUrl}
              </span>
            </div>
            <div>
              <Label className="text-xs uppercase tracking-widest text-muted-foreground">
                Новый URL картинки
              </Label>
              <Input name="imageUrl" defaultValue={h.imageUrl} className="mt-1 text-xs" />
            </div>
            <Button type="submit" size="sm">Сохранить</Button>
          </form>
        ))}
      </div>
    </div>
  );
}

