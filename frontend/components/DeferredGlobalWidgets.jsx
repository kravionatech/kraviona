"use client";

import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";

const LeadGenerationPopup = dynamic(
  () => import("@/components/Lead/LeadGenerationPopup"),
  { ssr: false },
);

export default function DeferredGlobalWidgets() {
  const pathname = usePathname();
  const isServicePage =
    pathname === "/services" || pathname?.startsWith("/services/");

  return isServicePage ? <LeadGenerationPopup /> : null;
}
