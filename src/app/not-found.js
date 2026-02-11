import Link from "next/link";
import { Container } from "../components/Container";

export const metadata = {
  title: "Страница не найдена",
};

export default function NotFound() {
  return (
    <div className="bg-[#e8f4e8]">
      <Container className="py-20">
        <div className="mx-auto max-w-xl rounded-3xl border border-black/10 bg-white p-8 text-center shadow-sm">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            404
          </div>
          <h1 className="mt-3 text-2xl font-semibold text-slate-900">
            Страница не найдена
          </h1>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            Похоже, ссылка устарела или страница была перенесена. Перейдите на
            главную или откройте каталог.
          </p>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Link
              href="/"
              className="inline-flex items-center justify-center rounded-full bg-[#FF5A2B] px-6 py-3 text-sm font-semibold text-white hover:bg-[#ff4b17]"
            >
              На главную
            </Link>
            <Link
              href="/sale"
              className="inline-flex items-center justify-center rounded-full border border-black/10 bg-black/3 px-6 py-3 text-sm font-semibold text-slate-700 hover:bg-black/5"
            >
              Каталог продажи
            </Link>
          </div>
        </div>
      </Container>
    </div>
  );
}

