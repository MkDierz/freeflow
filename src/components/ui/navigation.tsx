import Link from "next/link";
import { LinkItem } from "./link-item";
import { Credit } from "../card-credit";
import { links } from "@/const";

export function Navigation() {
  return (
    <div className="hidden border-r bg-muted/40 md:block">
      <div className="flex h-full max-h-screen flex-col gap-2">
        <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            {/* <Package2 className="h-6 w-6" /> */}
            <span className="">FreelanceFlow</span>
          </Link>
        </div>
        <div className="flex-1">
          <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
            {links.map((link) => (
              <LinkItem
                key={`${link.href}-link`}
                label={link.label}
                href={link.href}
              />
            ))}
          </nav>
        </div>
        <div className="mt-auto p-4">
          <Credit />
        </div>
      </div>
    </div>
  );
}
