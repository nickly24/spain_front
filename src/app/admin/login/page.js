import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

async function login(formData) {
  "use server";

  const password = formData.get("password")?.toString() || "";

  const expected = process.env.ADMIN_PASSWORD || "";
  if (!expected || password !== expected) {
    redirect("/admin/login?error=1");
  }

  const cookieStore = await cookies();
  cookieStore.set("mg_admin_auth", "1", {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
  });

  const nextPath = formData.get("next")?.toString() || "/admin";
  redirect(nextPath);
}

export default function AdminLoginPage({ searchParams }) {
  const resolved = searchParams || {};
  const error = resolved.error;
  const next = typeof resolved.next === "string" ? resolved.next : "/admin";

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardDescription className="text-[11px] font-semibold uppercase tracking-widest">
            MG Group — CMS
          </CardDescription>
          <CardTitle className="text-xl">Вход в админку</CardTitle>
          <CardDescription>Доступ только для команды MG Group.</CardDescription>
        </CardHeader>
        <CardContent>
          {error ? (
            <div className="mb-4 rounded-xl border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
              Неверный пароль. Попробуйте ещё раз.
            </div>
          ) : null}

          <form action={login} className="space-y-4">
            <input type="hidden" name="next" defaultValue={next} />

            <div className="space-y-2">
              <Label htmlFor="admin_password">Пароль</Label>
              <Input id="admin_password" name="password" type="password" />
            </div>

            <Button type="submit" className="w-full">
              Войти
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

