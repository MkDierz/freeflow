import { TransactionInputSchema } from "@/schemas";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";

import { z } from "zod";

export const transactionRouter = createTRPCRouter({
  create: protectedProcedure
    .input(TransactionInputSchema)
    .mutation(async ({ ctx, input }) => {
      const { walletId, categoryId, tags, ...data } = input;

      const queries = [];

      queries.push(
        ctx.db.wallet.update({
          where: {
            id: walletId,
          },
          data: {
            balance: {
              [input.type == "income" ? "increment" : "decrement"]: input.value,
            },
          },
        }),
      );
      queries.push(
        ctx.db.transaction.create({
          data: {
            ...data,
            user: {
              connect: {
                id: ctx.session.user.id,
              },
            },
            wallet: {
              connect: {
                id: walletId,
              },
            },
            category: {
              connect: {
                id: categoryId,
              },
            },
            ...(tags && {
              tags: {
                connect: tags.map((id) => ({ id: id.value })),
              },
            }),
          },
        }),
      );
      return await ctx.db.$transaction(queries);
    }),
  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        data: TransactionInputSchema,
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { walletId, tags, ...data } = input.data;

      const oldT = await ctx.db.transaction.findUniqueOrThrow({
        where: {
          id: input.id,
        },
        include: {
          tags: true,
        },
      });

      const queries = [];

      if (walletId !== oldT.walletId) {
        queries.push(
          ctx.db.wallet.update({
            where: {
              id: oldT.walletId,
            },
            data: {
              balance: {
                [oldT.type == "income" ? "increment" : "decrement"]: oldT.value,
              },
            },
          }),
        );
        queries.push(
          ctx.db.wallet.update({
            where: {
              id: walletId,
            },
            data: {
              balance: {
                [data.type == "income" ? "increment" : "decrement"]: data.value,
              },
            },
          }),
        );
      } else {
        const oldValue = oldT.value * (oldT.type === "income" ? 1 : -1);
        const newValue = data.value * (data.type === "income" ? 1 : -1);

        queries.push(
          ctx.db.wallet.update({
            where: {
              id: walletId,
            },
            data: {
              balance: {
                decrement: oldValue - newValue,
              },
            },
          }),
        );
      }
      // queries.push(ctx.db.)
      queries.push(
        ctx.db.transaction.update({
          where: {
            id: input.id,
          },
          data: {
            ...(tags && {
              tags: {
                disconnect: oldT.tags.map((tag) => ({ id: tag.id })),
              },
            }),
          },
        }),
      );
      queries.push(
        ctx.db.transaction.update({
          where: {
            id: input.id,
          },
          data: {
            ...data,
            ...(tags && {
              tags: {
                connect: tags.map((tag) => ({ id: tag.value })),
                // disconnect: oldT.tags.map((tag) => ({ id: tag.id })),
              },
            }),
          },
        }),
      );
      return await ctx.db.$transaction(queries);
    }),

  delete: protectedProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.transaction.delete({
        where: {
          id: input,
        },
      });
    }),

  getAll: protectedProcedure
    .input(
      z
        .object({
          type: z.enum(["income", "expense"]).optional().nullable(),
          categoryId: z.string().nullable().optional(),
          walletId: z.string().nullable().optional(),
        })
        .optional()
        .nullable(),
    )
    .query(({ ctx, input }) => {
      return ctx.db.transaction.findMany({
        orderBy: { createdAt: "desc" },
        where: {
          userId: ctx.session.user.id,
          ...(input?.type && { type: input.type }),
          ...(input?.categoryId && { categoryId: input.categoryId }),
          ...(input?.walletId && { walletId: input.walletId }),
        },
        include: {
          wallet: true,
          category: {
            include: {
              parent: true,
            },
          },
          tags: true,
        },
      });
    }),
});
