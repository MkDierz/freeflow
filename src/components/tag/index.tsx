"use client";

import { api, type RouterOutputs } from "@/trpc/react";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { ScrollBar } from "../ui/scroll-area";
import { SymbolIcon } from "@radix-ui/react-icons";
import { TagForm } from "./form";
import { TagCard } from "./card";
import { BreadcrumbItems } from "../breadcrumb-item";

export function Tag() {
  const { data, isLoading, refetch } = api.tag.getAll.useQuery();
  const TagFormWarper = () => data && <TagForm refetch={refetch} />;

  function Empty() {
    return (
      <>
        <h3 className="text-2xl font-bold tracking-tight">You have no tag</h3>
        <TagFormWarper />
      </>
    );
  }
  function TagCards({ data }: { data: RouterOutputs["tag"]["getAll"] }) {
    return data.map((d) => <TagCard data={d} key={d.id} refetch={refetch} />);
  }

  return (
    <>
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="text-lg font-semibold md:text-2xl">Tag</h1>
          <BreadcrumbItems />
        </div>
        <TagFormWarper />
      </div>
      {(isLoading || data?.length === 0 || !data) && (
        <div className="flex w-full flex-1 flex-grow rounded-lg border border-dashed shadow-sm">
          <div className="flex h-full w-full  items-center justify-center">
            <div className="flex flex-col items-center gap-2 text-center">
              {isLoading ? <TagLoading /> : <Empty />}
              <p className="text-sm text-muted-foreground">
                You can start documenting your expenses and income after
                creating a tag.
              </p>
            </div>
          </div>
        </div>
      )}
      {data && data?.length !== 0 && (
        <ScrollArea className="w-full flex-1 overflow-y-auto rounded-md border border-dashed p-1">
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-3">
            <TagCards data={data} />
          </div>
          <ScrollBar orientation="vertical" />
        </ScrollArea>
      )}
    </>
  );
}

function TagLoading() {
  return (
    <>
      <SymbolIcon className="h-8 w-8 animate-spin" />
      <h3 className="text-2xl font-bold tracking-tight">Loading Your Tag</h3>
    </>
  );
}
