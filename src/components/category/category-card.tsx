"use client";

import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "../ui/button";
import { SymbolIcon, TrashIcon } from "@radix-ui/react-icons";
import { api, type RouterOutputs } from "@/trpc/react";
import { CategoryForm } from "./category-form";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

export function CategoryCard({
  data,
  refetch,
  category,
}: {
  data: RouterOutputs["category"]["getAll"][0];
  category: RouterOutputs["category"]["getAll"];
  refetch: VoidFunction;
}) {
  const deleteCategory = api.category.delete.useMutation({
    onSuccess: async () => {
      refetch();
    },
  });
  return (
    <Card className="flex flex-col justify-between">
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <CardTitle className="flex w-full items-center justify-between">
          {/* <div className="flex gap-2">
            <span className="text-sm font-medium">{data.parent?.name}</span>
            <span className="text-sm font-medium">{data.name}</span>
          </div> */}
          <Breadcrumb>
            <BreadcrumbList>
              {data.parent && (
                <>
                  <BreadcrumbItem>
                    <BreadcrumbLink>{data.parent?.name}</BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                </>
              )}
              <BreadcrumbItem>
                <BreadcrumbPage>{data.name}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <div className="flex gap-2">
            <Button
              variant={"destructive"}
              size={"icon"}
              onClick={() => deleteCategory.mutate(data.id)}
            >
              {deleteCategory.isPending ? (
                <SymbolIcon className="animate-spin" />
              ) : (
                <TrashIcon />
              )}
            </Button>
            {category && (
              <CategoryForm
                value={data}
                id={data.id}
                refetch={refetch}
                category={category}
              />
            )}
          </div>
        </CardTitle>
      </CardHeader>
      {/* <CardContent className="flex flex-col items-start justify-start">
        <div className="text-xl font-bold">{rupiah.format(data.balance)}</div>
        <CardDescription>{data.description}</CardDescription>
      </CardContent> */}
    </Card>
  );
}
