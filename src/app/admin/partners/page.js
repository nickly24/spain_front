import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { uploadFile, deleteFile } from "@/lib/s3";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const dynamic = "force-dynamic";

function safeFileName(input) {
  const cleaned = String(input || "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "_")
    .replace(/[^a-z0-9_-]/g, "")
    .slice(0, 48);
  return cleaned || "logo";
}

async function savePartnerLogo(file, prefix = "partner") {
  if (!file || typeof file === "string" || file.size === 0) return null;
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const original = file.name || "logo";
  const ext = original.split(".").pop()?.toLowerCase() || "png";
  const base = safeFileName(original.replace(/\.[^.]+$/, ""));
  const key = `uploads/partners/${prefix}_${base}_${Date.now()}.${ext}`;

  return await uploadFile(buffer, key, file.type || "image/png");
}

async function createPartner(formData) {
  "use server";

  const name = (formData.get("name")?.toString() || "").trim() || null;
  const href = (formData.get("href")?.toString() || "").trim() || null;
  const sortOrder = Number(formData.get("sortOrder") || 0) || 0;
  const visible = formData.get("visible")?.toString() === "on";
  const file = formData.get("logo");

  const logoUrl = await savePartnerLogo(file, "partner_new");
  if (!logoUrl) return;

  await prisma.partner.create({
    data: { name, href, logoUrl, sortOrder, visible },
  });

  revalidatePath("/", "layout");
  redirect("/admin/partners");
}

async function updatePartner(formData) {
  "use server";

  const id = Number(formData.get("id"));
  if (!id) return;

  const name = (formData.get("name")?.toString() || "").trim() || null;
  const href = (formData.get("href")?.toString() || "").trim() || null;
  const sortOrder = Number(formData.get("sortOrder") || 0) || 0;
  const visible = formData.get("visible")?.toString() === "on";
  const file = formData.get("logo");

  const current = await prisma.partner.findUnique({ where: { id } });
  if (!current) return;

  let logoUrl = current.logoUrl;
  const uploaded = await savePartnerLogo(file, `partner_${id}`);
  if (uploaded) {
    await deleteFile(logoUrl);
    logoUrl = uploaded;
  }

  await prisma.partner.update({
    where: { id },
    data: { name, href, sortOrder, visible, logoUrl },
  });

  revalidatePath("/", "layout");
  redirect("/admin/partners");
}

async function deletePartner(formData) {
  "use server";
  const id = Number(formData.get("id"));
  if (!id) return;

  const row = await prisma.partner.findUnique({ where: { id } });
  if (row?.logoUrl) await deleteFile(row.logoUrl);

  await prisma.partner.delete({ where: { id } });
  revalidatePath("/", "layout");
  redirect("/admin/partners");
}

export default async function AdminPartnersPage() {
  const partners = await prisma.partner.findMany({
    orderBy: [{ visible: "desc" }, { sortOrder: "asc" }, { id: "asc" }],
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Партнёры</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Логотипы и ссылки для карусели партнёров перед футером на всех страницах.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Добавить партнёра</CardTitle>
          <CardDescription>Загрузите логотип и при желании добавьте ссылку.</CardDescription>
        </CardHeader>
        <CardContent>
          <form action={createPartner} className="grid grid-cols-1 gap-4 lg:grid-cols-12">
            <div className="lg:col-span-3 space-y-2">
              <Label>Название (необязательно)</Label>
              <Input name="name" placeholder="Например: Partner Inc." />
            </div>
            <div className="lg:col-span-4 space-y-2">
              <Label>Ссылка (необязательно)</Label>
              <Input name="href" placeholder="https://..." />
            </div>
            <div className="lg:col-span-2 space-y-2">
              <Label>Sort</Label>
              <Input name="sortOrder" type="number" defaultValue={0} />
            </div>
            <div className="lg:col-span-2 flex items-end gap-2">
              <label className="flex items-center gap-2 text-sm text-muted-foreground">
                <input type="checkbox" name="visible" defaultChecked className="accent-primary" />
                Видим
              </label>
            </div>
            <div className="lg:col-span-12 grid grid-cols-1 gap-3 md:grid-cols-12">
              <div className="md:col-span-8 space-y-2">
                <Label>Логотип (файл)</Label>
                <input
                  type="file"
                  name="logo"
                  accept="image/*"
                  required
                  className="block w-full text-sm file:mr-3 file:rounded-md file:border-0 file:bg-secondary file:px-3 file:py-2 file:text-sm file:font-semibold file:text-secondary-foreground hover:file:opacity-90"
                />
              </div>
              <div className="md:col-span-4 flex items-end justify-end">
                <Button type="submit">Добавить</Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>

      <div className="space-y-4">
        {partners.map((p) => (
          <Card key={p.id}>
            <CardHeader className="flex-row items-start justify-between gap-4 space-y-0">
              <div>
                <CardTitle className="text-base">
                  {p.name || `Партнёр #${p.id}`}
                </CardTitle>
                <CardDescription className="text-xs">
                  {p.href ? p.href : "Без ссылки"} • logo: {p.logoUrl}
                </CardDescription>
              </div>
              <div className="flex items-center gap-2">
                {p.visible ? null : (
                  <span className="rounded-full border border-border bg-muted/30 px-3 py-1 text-xs text-muted-foreground">
                    скрыт
                  </span>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
                <div className="lg:col-span-3">
                  <div className="rounded-2xl border border-border bg-background p-4">
                    <img
                      src={p.logoUrl}
                      alt={p.name || `Партнёр ${p.id}`}
                      className="mx-auto max-h-16 max-w-full object-contain"
                      loading="lazy"
                    />
                  </div>
                </div>

                <div className="lg:col-span-9 space-y-3">
                  <form action={updatePartner} className="grid grid-cols-1 gap-3 md:grid-cols-12">
                    <input type="hidden" name="id" defaultValue={p.id} />
                    <div className="md:col-span-3 space-y-2">
                      <Label>Название</Label>
                      <Input name="name" defaultValue={p.name || ""} />
                    </div>
                    <div className="md:col-span-5 space-y-2">
                      <Label>Ссылка</Label>
                      <Input name="href" defaultValue={p.href || ""} placeholder="https://..." />
                    </div>
                    <div className="md:col-span-2 space-y-2">
                      <Label>Sort</Label>
                      <Input name="sortOrder" type="number" defaultValue={p.sortOrder ?? 0} />
                    </div>
                    <div className="md:col-span-2 flex items-end gap-2">
                      <label className="flex items-center gap-2 text-sm text-muted-foreground">
                        <input type="checkbox" name="visible" defaultChecked={p.visible} className="accent-primary" />
                        Видим
                      </label>
                    </div>

                    <div className="md:col-span-8 space-y-2">
                      <Label>Заменить логотип (файл)</Label>
                      <input
                        type="file"
                        name="logo"
                        accept="image/*"
                        className="block w-full text-sm file:mr-3 file:rounded-md file:border-0 file:bg-secondary file:px-3 file:py-2 file:text-sm file:font-semibold file:text-secondary-foreground hover:file:opacity-90"
                      />
                    </div>
                    <div className="md:col-span-4 flex items-end justify-end gap-2">
                      <Button type="submit" variant="outline">Сохранить</Button>
                    </div>
                  </form>

                  <form action={deletePartner} className="flex justify-end">
                    <input type="hidden" name="id" defaultValue={p.id} />
                    <Button type="submit" variant="destructive">
                      Удалить
                    </Button>
                  </form>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {!partners.length ? (
          <div className="rounded-2xl border border-border bg-muted/30 p-6 text-sm text-muted-foreground">
            Пока нет партнёров. Добавьте первый логотип выше.
          </div>
        ) : null}
      </div>
    </div>
  );
}
