"use client";

import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Form } from "../ui/form";
import { FormInput } from "../ui/form-input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormSelect } from "../ui/form-select";
import { type RouterInputs, api } from "@/trpc/react";
import { useState } from "react";
import { Pencil1Icon, SymbolIcon } from "@radix-ui/react-icons";
import { useToast } from "../ui/use-toast";
import { FormMultiSelect } from "../ui/form-multi-select";
import { useCategory, useTag, useWallet } from "../../hooks";
import { TransactionInputSchema } from "@/schemas";
export function TransactionForm({
  value = {},
  id,
}: {
  value?: Partial<RouterInputs["transaction"]["create"]>;
  id?: string;
}) {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const utils = api.useUtils();

  const onSuccess = async () => {
    await utils.transaction.getAll.refetch();
    setOpen(false);
    toast({ title: id ? "Transaction Updated" : "Transaction Created" });
  };

  const createTransaction = api.transaction.create.useMutation({ onSuccess });
  const updateTransaction = api.transaction.update.useMutation({ onSuccess });

  const form = useForm<RouterInputs["transaction"]["create"]>({
    resolver: zodResolver(TransactionInputSchema),
    defaultValues: value,
  });
  form.watch("type");

  const { data: categories } = useCategory(form.getValues("type"));

  const { data: wallets } = useWallet();
  const { data: tags } = useTag();
  async function onSubmit(values: RouterInputs["transaction"]["create"]) {
    if (id) {
      updateTransaction.mutate({ id, data: values });
    } else {
      createTransaction.mutate(values);
    }
  }

  return (
    <div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button size={id ? "icon" : "default"}>
            {id ? <Pencil1Icon /> : "Create Transaction"}
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {id ? "Update" : "Create New"} Transaction
            </DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <FormInput
                label={"Total"}
                placeholder={"Transaction total"}
                name="value"
                type="number"
              />
              <FormSelect
                label="Type"
                placeholder="Please select Transaction type"
                name="type"
                options={[
                  { value: "income", label: "Income" },
                  { value: "expense", label: "Expense" },
                ]}
              />
              <FormSelect
                label="Category"
                placeholder="Please select Transaction Category"
                name="categoryId"
                options={categories?.map((category) => ({
                  label: category.name,
                  value: category.id,
                }))}
              />
              <FormSelect
                label="Wallet"
                placeholder="Please select Transaction Wallet"
                name="walletId"
                options={wallets?.map((wallet) => ({
                  label: wallet.name,
                  value: wallet.id,
                }))}
              />
              <FormMultiSelect
                label="Tag"
                placeholder="Please select Transaction Tag"
                name="tags"
                options={tags?.map((tag) => ({
                  label: tag.name,
                  value: tag.id,
                }))}
              />
              <Button
                type="submit"
                disabled={
                  createTransaction.isPending || updateTransaction.isPending
                }
              >
                Submit
                {(createTransaction.isPending ||
                  updateTransaction.isPending) && (
                  <SymbolIcon className="animate-spin" />
                )}
              </Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
