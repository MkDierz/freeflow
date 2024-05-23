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
import { type z } from "zod";
import { FormSelect } from "../ui/form-select";
import { WalletInputSchema } from "@/schemas";
import { api } from "@/trpc/react";
import { useState } from "react";
import { Pencil1Icon, SymbolIcon } from "@radix-ui/react-icons";
import { useToast } from "../ui/use-toast";

export function WalletForm({
  refetch,
  value = {
    name: "",
    description: "",
    balance: 0,
    bankAccountNumber: "",
  },
  id,
}: {
  refetch: VoidFunction;
  value?: Partial<z.infer<typeof WalletInputSchema>>;
  id?: string;
}) {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();

  const onSuccess = () => {
    refetch();
    setOpen(false);
    toast({ title: id ? "Wallet Updated" : "Wallet Created" });
  };

  const createWallet = api.wallet.create.useMutation({ onSuccess });
  const updateWallet = api.wallet.update.useMutation({ onSuccess });

  const form = useForm<z.infer<typeof WalletInputSchema>>({
    resolver: zodResolver(WalletInputSchema),
    defaultValues: value,
  });

  async function onSubmit(values: z.infer<typeof WalletInputSchema>) {
    if (id) {
      updateWallet.mutate({ id, data: values });
    } else {
      createWallet.mutate(values);
    }
  }

  return (
    <div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button size={id ? "icon" : "default"}>
            {id ? <Pencil1Icon /> : "Create Wallet"}
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{id ? "Update" : "Create New"} Wallet</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <FormInput
                label={"Name"}
                placeholder={"Wallet name"}
                name="name"
              />
              <FormInput
                label={"Balance"}
                placeholder={"Wallet balance"}
                name="balance"
                type="number"
              />
              <FormInput
                label={"Description"}
                placeholder={"Wallet description"}
                name="description"
              />
              <FormSelect
                label="Type"
                placeholder="Please select wallet type"
                name="type"
                options={[
                  { value: "cash", label: "Cash" },
                  { value: "bank", label: "Bank" },
                ]}
              />
              {form.getValues("type") === "bank" && (
                <FormInput
                  label={"Bank Account Number"}
                  placeholder={"Wallet Bank Account Number"}
                  name="bankAccountNumber"
                />
              )}
              <Button type="submit" disabled={createWallet.isPending}>
                Submit
                {createWallet.isPending && (
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
