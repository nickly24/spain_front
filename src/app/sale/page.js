import { redirect } from "next/navigation";
import { DEFAULT_LOCALE } from "../../lib/i18n";

export default function SaleRedirect() {
  redirect(`/${DEFAULT_LOCALE}/sale`);
}
