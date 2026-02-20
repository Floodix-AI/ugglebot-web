"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutGrid, Link as LinkIcon, CreditCard } from "lucide-react";

const links = [
  { href: "/dashboard", label: "Översikt", icon: LayoutGrid, exact: true },
  { href: "/dashboard/pair", label: "Parkoppla", icon: LinkIcon },
  { href: "/dashboard/billing", label: "Prenumeration", icon: CreditCard },
];

export function DashboardNav() {
  const pathname = usePathname();

  return (
    <>
      {links.map((link) => {
        const isActive = link.exact
          ? pathname === link.href
          : pathname.startsWith(link.href);

        return (
          <Link
            key={link.href}
            href={link.href}
            className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-sm font-medium transition-all ${
              isActive
                ? "text-white bg-white/15 shadow-sm shadow-glow-500/10"
                : "text-night-300 hover:text-white hover:bg-white/[0.08]"
            }`}
          >
            <link.icon className="h-4 w-4" />
            <span className="hidden md:inline">{link.label}</span>
          </Link>
        );
      })}
    </>
  );
}
