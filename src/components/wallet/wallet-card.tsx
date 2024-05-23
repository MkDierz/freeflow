"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "../ui/button";
import { SymbolIcon, TrashIcon } from "@radix-ui/react-icons";
import { type Wallet } from "@prisma/client";
import { api } from "@/trpc/react";
import { WalletForm } from "./wallet-form";

export function WalletCard({
  data,
  refetch,
}: {
  data: Wallet;
  refetch: VoidFunction;
}) {
  const rupiah = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
  });
  const deleteWallet = api.wallet.delete.useMutation({
    onSuccess: async () => {
      refetch();
    },
  });
  return (
    <Card className="flex flex-col justify-between">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="flex w-full justify-between">
          <div>
            <span className="text-sm font-medium">{data.name}</span>
            <p className="text-xs text-muted-foreground">
              {data.bankAccountNumber}
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant={"destructive"}
              size={"icon"}
              onClick={() => deleteWallet.mutate(data.id)}
            >
              {deleteWallet.isPending ? (
                <SymbolIcon className="animate-spin" />
              ) : (
                <TrashIcon />
              )}
            </Button>
            <WalletForm value={data} id={data.id} refetch={refetch} />
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-start justify-start">
        <div className="text-xl font-bold">{rupiah.format(data.balance)}</div>
        <CardDescription>{data.description}</CardDescription>
      </CardContent>
    </Card>
  );
}
