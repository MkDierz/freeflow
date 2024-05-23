"use client";

import { usePathname } from "next/navigation";
import { Fragment } from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

export function BreadcrumbItems() {
  const path = usePathname();
  return (
    <Breadcrumb>
      <BreadcrumbList>
        {path
          .split("/")
          .filter((f) => f)
          .map((subPath, index, array) => {
            const fullPath = array.slice(0, index + 1).join("/");
            const isLast = index + 1 === array.length;
            const formattedSubPath =
              subPath.charAt(0).toUpperCase() + subPath.slice(1).toLowerCase();

            return (
              <Fragment key={subPath}>
                {isLast ? (
                  <BreadcrumbItem>
                    <BreadcrumbPage>{formattedSubPath}</BreadcrumbPage>
                  </BreadcrumbItem>
                ) : (
                  <BreadcrumbItem>
                    <BreadcrumbLink href={`/${fullPath}`}>
                      {formattedSubPath}
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                )}
                {!isLast && <BreadcrumbSeparator />}
              </Fragment>
            );
          })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
