"use client";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { HamburgerMenuIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import { LinkItemSheet } from "./link-item";
import { links } from "@/const";
import { Credit } from "../card-credit";
import { useState } from "react";

export function NavigationSheet() {
  const [sheetOpen, setSheetOpen] = useState(false);
  return (
    <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="shrink-0 md:hidden">
          <HamburgerMenuIcon className="h-4.5 w-4.5" />
          <span className="sr-only">Toggle navigation menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="flex flex-col">
        <nav className="grid gap-2 text-lg font-medium">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 text-lg font-semibold"
          >
            {/* <Package2 className="h-6 w-6" /> */}
            FreelanceFlow
            <span className="sr-only">FreelanceFlow</span>
          </Link>
          {links.map((link) => (
            <LinkItemSheet
              key={`${link.href}-link-sheet`}
              label={link.label}
              href={link.href}
              onClick={() => setSheetOpen(false)}
            />
          ))}
        </nav>
        <div className="mt-auto">
          <Credit />
        </div>
      </SheetContent>
    </Sheet>
  );
}
