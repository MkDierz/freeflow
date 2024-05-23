import { api } from "@/trpc/react";
import { type type, type categoryId } from "./type";

export function useTransaction(
  type: type,
  categoryId: categoryId,
  walletId: categoryId,
) {
  return api.transaction.getAll.useQuery({
    ...(type && { type }),
    ...(walletId && { walletId }),
    ...(categoryId && { categoryId }),
  });
}
export function useCategory(type: type, hasTransaction = false) {
  return api.category.getAll.useQuery({
    ...(type && { type }),
    ...(hasTransaction && { hasTransaction }),
  });
}
export function useWallet(hasTransaction = false) {
  return api.wallet.getAll.useQuery({
    ...(hasTransaction && { hasTransaction }),
  });
}
export function useTag(hasTransaction = false) {
  return api.tag.getAll.useQuery({
    ...(hasTransaction && { hasTransaction }),
  });
}
