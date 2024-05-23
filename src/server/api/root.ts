import { createCallerFactory, createTRPCRouter } from "./trpc";
import { postRouter } from "./routers/post";
import { walletRouter } from "./routers/wallet";
import { categoryRouter } from "./routers/category";
import { tagRouter } from "./routers/tag";
import { transactionRouter } from "./routers/transaction";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  post: postRouter,
  wallet: walletRouter,
  category: categoryRouter,
  tag: tagRouter,
  transaction: transactionRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter);
