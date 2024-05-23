import { z } from "zod";
import { type Prisma } from "@prisma/client";

import { CategoryInputSchema } from "@/schemas";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";

export const categoryRouter = createTRPCRouter({
  create: protectedProcedure
    .input(CategoryInputSchema)
    .mutation(async ({ ctx, input }) => {
      const { parentId, ...category } = input;
      const data: Prisma.CategoryCreateInput = {
        ...category,
        user: {
          connect: {
            id: ctx.session.user.id,
          },
        },
      };
      if (parentId) {
        data.parent = {
          connect: {
            id: parentId,
          },
        };
      }
      return await ctx.db.category.create({
        data,
      });
    }),
  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        data: CategoryInputSchema,
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { parentId, ...category } = input.data;
      const data: Prisma.CategoryCreateInput = {
        ...category,
        user: {
          connect: {
            id: ctx.session.user.id,
          },
        },
      };
      if (parentId) {
        data.parent = {
          connect: {
            id: parentId,
          },
        };
      }
      return await ctx.db.category.update({
        where: {
          id: input.id,
        },
        data,
      });
    }),

  delete: protectedProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.wallet.delete({
        where: {
          id: input,
        },
      });
    }),

  getAll: protectedProcedure
    .input(
      z
        .object({
          type: z.enum(["income", "expense"]).optional(),
          hasTransaction: z.oboolean().default(false).nullable(),
        })
        .optional(),
    )
    .query(async ({ ctx, input = {} }) => {
      // const { type } = input;
      return await ctx.db.category.findMany({
        orderBy: { createdAt: "desc" },
        where: {
          userId: ctx.session.user.id,
          ...(input.type && { type: input.type }),
          ...(input.hasTransaction && { transactions: { some: {} } }),
        },
        include: { parent: true },
      });
    }),
});
