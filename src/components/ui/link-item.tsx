"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function LinkItem({ label, href }: { label: string; href: string }) {
  const pathname = usePathname();

  if (pathname === href) {
    return (
      <Link
        href={href}
        className="hover:text-primary text-primary bg-muted flex items-center gap-3 rounded-lg px-3 py-2 transition-all"
      >
        {/* <Package className="h-4 w-4" /> */}
        {label}
      </Link>
    );
  }

  return (
    <Link
      href={href}
      className="text-muted-foreground hover:text-primary flex items-center gap-3 rounded-lg px-3 py-2 transition-all"
    >
      {/* <Home className="h-4 w-4" /> */}
      {label}
    </Link>
  );
}

export function LinkItemSheet({
  label,
  href,
  onClick,
}: {
  label: string;
  href: string;
  onClick: VoidFunction;
}) {
  const pathname = usePathname();

  if (pathname === href) {
    return (
      <Link
        href={href}
        className="bg-muted text-foreground hover:text-foreground mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2"
        onClick={() => onClick()}
      >
        {/* <Package className="h-4 w-4" /> */}
        {label}{" "}
      </Link>
    );
  }

  return (
    <Link
      href={href}
      className="text-muted-foreground hover:text-foreground mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2"
      onClick={() => onClick()}
    >
      {/* <Home className="h-4 w-4" /> */}
      {label}{" "}
    </Link>
  );
}
