import { Suspense } from "react";
import { prisma } from "../../lib/prisma";
import { AdminShell } from "./AdminShell";
import { AdminToastHandler } from "../../components/AdminToastHandler";

export const metadata = {
  title: {
    template: "Админка — %s",
    default: "Админка — MG Group",
  },
};

export default async function AdminLayout({ children }) {
  const [propertiesCount, newsCount, tagsCount, citiesCount, casesCount] = await Promise.all([
    prisma.property.count(),
    prisma.newsPost.count(),
    prisma.tag.count(),
    prisma.city.count(),
    prisma.constructionCase.count(),
  ]);

  const navSections = [
    {
      title: "Обзор",
      items: [{ href: "/admin", label: "Дашборд" }],
    },
    {
      title: "Каталог",
      items: [
        { href: "/admin/properties", label: "Объекты", badge: propertiesCount },
        { href: "/admin/tags", label: "Теги", badge: tagsCount },
        { href: "/admin/cities", label: "Города", badge: citiesCount },
      ],
    },
    {
      title: "Контент",
      items: [
        { href: "/admin/news", label: "Новости и статьи", badge: newsCount },
        { href: "/admin/pages", label: "Страницы и баннеры" },
        { href: "/admin/media", label: "Медиа" },
      ],
    },
    {
      title: "Сайт",
      items: [
        { href: "/admin/navigation", label: "Навигация" },
        { href: "/admin/contacts", label: "Контакты" },
        { href: "/admin/social", label: "Соцсети" },
        { href: "/admin/partners", label: "Партнёры" },
      ],
    },
    {
      title: "Строительство",
      items: [
        { href: "/admin/construction", label: "Этапы и услуги" },
        { href: "/admin/construction/cases", label: "Кейсы до/после", badge: casesCount },
      ],
    },
  ];

  return (
    <AdminShell navSections={navSections}>
      <Suspense fallback={null}>
        <AdminToastHandler />
      </Suspense>
      {children}
    </AdminShell>
  );
}

