import { TagInputSchema } from "@/schemas";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";

import { z } from "zod";

export const tagRouter = createTRPCRouter({
  create: protectedProcedure
    .input(TagInputSchema)
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.tag.create({
        data: {
          ...input,
          user: {
            connect: {
              id: ctx.session.user.id,
            },
          },
        },
      });
    }),
  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        data: TagInputSchema,
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.tag.update({
        where: {
          id: input.id,
        },
        data: input.data,
      });
    }),

  delete: protectedProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.tag.delete({
        where: {
          id: input,
        },
      });
    }),

  getAll: protectedProcedure
    .input(
      z
        .object({
          hasTransaction: z.oboolean().default(false).nullable(),
        })
        .optional(),
    )
    .query(({ ctx, input }) => {
      return ctx.db.tag.findMany({
        orderBy: { createdAt: "desc" },
        where: {
          userId: ctx.session.user.id,
          ...(input?.hasTransaction && { transactions: { some: {} } }),
        },
      });
    }),
});
