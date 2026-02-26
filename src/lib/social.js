import { prisma } from "./prisma";

export async function getSocialLinks() {
  return prisma.socialLink.findMany({
    where: { visible: true, url: { not: "" } },
    orderBy: [{ sortOrder: "asc" }, { id: "asc" }],
  });
}

