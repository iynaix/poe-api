import { router } from "../trpc"
import { priceRouter } from "./prices"
import { gemRouter } from "./gems"

export const appRouter = router({
    prices: priceRouter,
    gems: gemRouter,
})

// export type definition of API
export type AppRouter = typeof appRouter
