"use client";

import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "../ui/button";
import { SymbolIcon, TrashIcon } from "@radix-ui/react-icons";
import { api, type RouterOutputs } from "@/trpc/react";
import { TagForm } from "./form";

export function TagCard({
  data,
  refetch,
}: {
  data: RouterOutputs["tag"]["getAll"][0];
  refetch: VoidFunction;
}) {
  const deleteApi = api.tag.delete.useMutation({
    onSuccess: async () => {
      refetch();
    },
  });
  return (
    <Card className="flex flex-col justify-between">
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <CardTitle className="flex w-full items-center justify-between">
          <div className="flex flex-col">
            <span className="text-lg font-bold">{data.name}</span>
            <span className="text-sm font-normal">{data.description}</span>
          </div>
          <div className="flex gap-2">
            <Button
              variant={"destructive"}
              size={"icon"}
              onClick={() => deleteApi.mutate(data.id)}
            >
              {deleteApi.isPending ? (
                <SymbolIcon className="animate-spin" />
              ) : (
                <TrashIcon />
              )}
            </Button>
            <TagForm value={data} id={data.id} refetch={refetch} />
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
