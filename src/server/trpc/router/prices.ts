import { z } from "zod"

import { router, publicProcedure } from "../trpc"
import { fetchCombined } from "../../../graphql/combined/schema"

export type Price = {
    id: string
    name: string
    icon?: string
    divineValue: number
    chaosValue: number
}

export const priceRouter = router({
    byName: publicProcedure
        .input(z.object({ query: z.string() }))
        .query(async ({ input: { query } }): Promise<Price[]> => {
            if (!query) return []

            const re = new RegExp(query, "i")
            const prices = await fetchCombined("tmpstandard")

            return prices.filter((price) => re.test(price.name))
        }),
    list: publicProcedure
        .input(z.object({ ids: z.array(z.string()) }))
        .query(async ({ input: { ids } }): Promise<Record<string, Price>> => {
            // each id will only produce a single result
            const matchesByItemId: Record<string, Price> = {}

            const prices = await fetchCombined("tmpstandard")
            for (const price of prices) {
                // must be exact match
                const matchedId = ids.find((id) => id === price.id)
                if (matchedId) {
                    matchesByItemId[matchedId] = price
                }
            }

            return matchesByItemId
        }),
})
