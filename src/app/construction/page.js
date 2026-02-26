import { redirect } from "next/navigation";
import { DEFAULT_LOCALE } from "../../lib/i18n";

export default function ConstructionRedirect() {
  redirect(`/${DEFAULT_LOCALE}/construction`);
}
