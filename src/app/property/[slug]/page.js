import { redirect } from "next/navigation";
import { DEFAULT_LOCALE } from "../../../lib/i18n";

export default async function PropertySlugRedirect({ params }) {
  const resolved = typeof params?.then === "function" ? await params : params;
  const slug = resolved?.slug ?? "";
  redirect(`/${DEFAULT_LOCALE}/property/${slug}`);
}
