import { TransactionType, WalletType } from "@prisma/client";

import { z } from "zod";

const WalletTypeEnum = z.nativeEnum(WalletType);
const TransactionTypeEnum = z.nativeEnum(TransactionType);

export const WalletInputSchema = z.object({
  name: z.string(),
  balance: z.number(),
  description: z.string().optional().nullable(),
  bankAccountNumber: z.string().optional().nullable(),
  type: z.lazy(() => WalletTypeEnum),
});

export const CategoryInputSchema = z.object({
  name: z.string(),
  type: z.lazy(() => TransactionTypeEnum),
  parentId: z.string().optional().nullable(),
});

export const TagInputSchema = z.object({
  name: z.string(),
  description: z.string().optional().nullable(),
});

export const TransactionInputSchema = z.object({
  value: z.number(),
  type: z.lazy(() => TransactionTypeEnum),
  note: z.string().optional().nullable(),
  walletId: z.string(),
  categoryId: z.string(),
  tags: z
    .array(z.object({ label: z.string(), value: z.string() }))
    .nullable()
    .optional(),
});
