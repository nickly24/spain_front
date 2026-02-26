import { prisma } from "./prisma";

export async function getVisiblePartners() {
  return prisma.partner.findMany({
    where: { visible: true },
    orderBy: [{ sortOrder: "asc" }, { id: "asc" }],
    select: {
      id: true,
      name: true,
      logoUrl: true,
      href: true,
    },
  });
}

