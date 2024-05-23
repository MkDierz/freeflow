"use client";

import { type RouterOutputs } from "@/trpc/react";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { ScrollBar } from "../ui/scroll-area";
import { CrossCircledIcon, SymbolIcon } from "@radix-ui/react-icons";
import { type Transaction } from "@prisma/client";
import { BreadcrumbItems } from "../breadcrumb-item";
import { TransactionForm } from "./form";
import { TransactionCard } from "./card";
import { type ReactNode, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "../ui/button";
import { type type, type categoryId } from "../../type.d";
import { useTransaction, useCategory, useWallet } from "../../hooks";

export function Transaction() {
  const [type, setType] = useState<type>("");
  const [categoryId, setCategoryId] = useState<categoryId>("");
  const [walletId, setWalletId] = useState<categoryId>("");

  const { data: transactions, isLoading } = useTransaction(
    type,
    categoryId,
    walletId,
  );

  const { data: categories } = useCategory(type, true);
  const { data: wallets } = useWallet(true);
  return (
    <>
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="text-lg font-semibold md:text-2xl">Transaction</h1>
          <BreadcrumbItems />
        </div>
        <TransactionForm />
      </div>
      <div className="flex flex-wrap gap-3 ">
        <div className="flex gap-1 rounded-md border border-dashed">
          <Select
            value={type}
            onValueChange={(v) => {
              if (
                v == "income" ||
                v == "expense" ||
                v == "" ||
                v == undefined
              ) {
                setType(v);
              }
              setCategoryId("");
            }}
          >
            <SelectTrigger className="w-fit">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="income">Income</SelectItem>
              <SelectItem value="expense">Expense</SelectItem>
            </SelectContent>
          </Select>
          {type && (
            <Button variant={"ghost"} size={"icon"} onClick={() => setType("")}>
              <CrossCircledIcon className="h-4 w-4" />
            </Button>
          )}
        </div>

        <div className="flex gap-1 rounded-md border border-dashed">
          <Select
            value={categoryId}
            onValueChange={(v) => {
              setCategoryId(v);
            }}
          >
            <SelectTrigger className="w-fit">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              {categories?.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {categoryId && (
            <Button
              variant={"destructive"}
              size={"icon"}
              onClick={() => setCategoryId("")}
            >
              <CrossCircledIcon className="h-4 w-4" />
            </Button>
          )}
        </div>
        <div className="flex gap-1 rounded-md border border-dashed">
          <Select
            value={walletId}
            onValueChange={(v) => {
              setWalletId(v);
            }}
          >
            <SelectTrigger className="w-fit">
              <SelectValue placeholder="Wallet" />
            </SelectTrigger>
            <SelectContent>
              {wallets?.map((wallet) => (
                <SelectItem key={wallet.id} value={wallet.id}>
                  {wallet.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {walletId && (
            <Button
              variant={"ghost"}
              size={"icon"}
              onClick={() => setWalletId("")}
            >
              <CrossCircledIcon className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
      {(isLoading || transactions?.length === 0 || !transactions) && (
        <div className="flex w-full flex-1 flex-grow rounded-lg border border-dashed shadow-sm">
          <div className="flex h-full w-full  items-center justify-center">
            <div className="flex flex-col items-center gap-2 text-center">
              {isLoading ? (
                <TransactionLoading />
              ) : (
                <Empty>
                  <TransactionForm />
                </Empty>
              )}
              <p className="text-sm text-muted-foreground">
                You can start documenting your expenses and income after
                creating a transaction.
              </p>
            </div>
          </div>
        </div>
      )}
      {transactions && transactions?.length !== 0 && (
        <>
          <ScrollArea className="w-full flex-1 overflow-y-auto rounded-md border border-dashed p-1">
            <div className="grid grid-cols-1 gap-4 ">
              <TransactionCards transactions={transactions} />
            </div>
            <ScrollBar orientation="vertical" />
          </ScrollArea>
        </>
      )}
    </>
  );
}

function TransactionCards({
  transactions,
}: {
  transactions: RouterOutputs["transaction"]["getAll"];
}) {
  return transactions.map((card) => (
    <TransactionCard data={card} key={card.id} />
  ));
}

function Empty({ children }: { children: ReactNode }) {
  return (
    <>
      <h3 className="text-2xl font-bold tracking-tight">
        You have no transaction
      </h3>
      {children}
    </>
  );
}

function TransactionLoading() {
  return (
    <>
      <SymbolIcon className="h-8 w-8 animate-spin" />
      <h3 className="text-2xl font-bold tracking-tight">
        Loading Your Transaction
      </h3>
    </>
  );
}
