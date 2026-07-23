import { router } from "../trpc"
import { priceRouter } from "./prices"

export const appRouter = router({
    prices: priceRouter,
})

// export type definition of API
export type AppRouter = typeof appRouter
