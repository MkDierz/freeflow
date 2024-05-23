"use server";

import { api } from "@/trpc/server";
import { FormSelect } from "./ui/form-select";

export async function WalletSelect() {
  const wallets = await api.wallet.getAll();
  return (
    <FormSelect
      label="Wallet"
      placeholder="Please select Transaction Wallet"
      name="walletId"
      options={wallets?.map((wallet) => ({
        label: wallet.name,
        value: wallet.id,
      }))}
    />
  );
}
