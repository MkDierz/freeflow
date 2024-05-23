"use client";

import { Card, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "../ui/button";
import { SymbolIcon, TrashIcon } from "@radix-ui/react-icons";
import { api, type RouterOutputs } from "@/trpc/react";
import { TransactionForm } from "./form";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "../ui/breadcrumb";
import { Badge } from "../ui/badge";

export function TransactionCard({
  data,
}: {
  data: RouterOutputs["transaction"]["getAll"][0];
}) {
  const utils = api.useUtils();

  const rupiah = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
  });

  const deleteTransaction = api.transaction.delete.useMutation({
    onSuccess: async () => {
      await utils.transaction.getAll.refetch();
      await utils.category.getAll.refetch();
    },
  });
  return (
    <Card className="flex flex-col justify-between">
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <CardTitle className="flex w-full items-center justify-between">
          <div className="flex flex-col gap-2 font-light">
            <span>{data.wallet.name}</span>
            <Breadcrumb>
              <BreadcrumbList>
                {data.category.parent && (
                  <>
                    <BreadcrumbItem>
                      <BreadcrumbLink>
                        {data.category.parent?.name}
                      </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                  </>
                )}
                <BreadcrumbItem>
                  <BreadcrumbLink>{data.category.name}</BreadcrumbLink>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
            {data.type == "expense" ? (
              <div className="text-xl font-bold text-red-600">
                - {rupiah.format(data.value)}
              </div>
            ) : (
              <div className="text-xl font-bold text-green-600">
                + {rupiah.format(data.value)}
              </div>
            )}
          </div>
          <div className="flex gap-2 self-start">
            <Button
              variant={"destructive"}
              size={"icon"}
              onClick={() => deleteTransaction.mutate(data.id)}
            >
              {deleteTransaction.isPending ? (
                <SymbolIcon className="animate-spin" />
              ) : (
                <TrashIcon />
              )}
            </Button>
            <TransactionForm
              value={{
                ...(({ tags, ...o }) => ({
                  ...o,
                  tags: tags.map((tag) => ({
                    value: tag.id,
                    label: tag.name,
                  })),
                }))(data),
              }}
              id={data.id}
            />
          </div>
        </CardTitle>
      </CardHeader>
      {data.tags.length !== 0 && (
        <CardFooter className="flex gap-2">
          {data.tags.map((tag) => (
            <Badge key={tag.id}>#{tag.name}</Badge>
          ))}
        </CardFooter>
      )}
    </Card>
  );
}
