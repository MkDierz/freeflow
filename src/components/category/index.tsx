"use client";

import { api, type RouterOutputs } from "@/trpc/react";
import { CategoryForm } from "./category-form";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { ScrollBar } from "../ui/scroll-area";
import { SymbolIcon } from "@radix-ui/react-icons";
import { type Category } from "@prisma/client";
import { CategoryCard } from "./category-card";
import { BreadcrumbItems } from "../breadcrumb-item";

export function Category() {
  const { data, isLoading, refetch } = api.category.getAll.useQuery();
  const CategoryFormWarper = () =>
    data && <CategoryForm refetch={refetch} category={data} />;

  function Empty() {
    return (
      <>
        <h3 className="text-2xl font-bold tracking-tight">
          You have no category
        </h3>
        <CategoryFormWarper />
      </>
    );
  }
  function CategoryCards({
    data,
  }: {
    data: RouterOutputs["category"]["getAll"];
  }) {
    return data.map((d) => (
      <CategoryCard data={d} key={d.id} refetch={refetch} category={data} />
    ));
  }

  return (
    <>
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="text-lg font-semibold md:text-2xl">Category</h1>
          <BreadcrumbItems />
        </div>
        <CategoryFormWarper />
      </div>
      {(isLoading || data?.length === 0 || !data) && (
        <div className="flex w-full flex-1 flex-grow rounded-lg border border-dashed shadow-sm">
          <div className="flex h-full w-full  items-center justify-center">
            <div className="flex flex-col items-center gap-2 text-center">
              {isLoading ? <CategoryLoading /> : <Empty />}
              <p className="text-sm text-muted-foreground">
                You can start documenting your expenses and income after
                creating a category.
              </p>
            </div>
          </div>
        </div>
      )}
      {data && data?.length !== 0 && (
        <ScrollArea className="w-full flex-1 overflow-y-auto rounded-md border border-dashed p-1">
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-3">
            <CategoryCards data={data} />
          </div>
          <ScrollBar orientation="vertical" />
        </ScrollArea>
      )}
    </>
  );
}

function CategoryLoading() {
  return (
    <>
      <SymbolIcon className="h-8 w-8 animate-spin" />
      <h3 className="text-2xl font-bold tracking-tight">
        Loading Your Category
      </h3>
    </>
  );
}
