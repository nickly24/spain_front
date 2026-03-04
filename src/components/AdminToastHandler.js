"use client";

import { useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { toast } from "@/hooks/use-toast";

export function AdminToastHandler() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const message = searchParams.get("message");
  const type = searchParams.get("type");

  useEffect(() => {
    if (message) {
      const isError = type === "error";
      if (isError) {
        // Ошибки не показываем — только убираем параметры из URL
      } else {
        const isSuccess = type === "success";
        const variant = isSuccess ? "success" : "default";
        toast({
          description: message,
          variant,
        });
      }

      // Убираем параметры из URL
      const url = new URL(window.location.href);
      url.searchParams.delete("message");
      url.searchParams.delete("type");
      router.replace(url.pathname + url.search, { scroll: false });
    }
  }, [message, type, router]);

  return null;
}
