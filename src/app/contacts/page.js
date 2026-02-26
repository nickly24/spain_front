import { redirect } from "next/navigation";
import { DEFAULT_LOCALE } from "../../lib/i18n";

export default function ContactsRedirect() {
  redirect(`/${DEFAULT_LOCALE}/contacts`);
}
