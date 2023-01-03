import { z } from "zod"

import { router, publicProcedure } from "../trpc"
import { fetchCurrencies } from "../../../graphql/currencies/fetcher"
import { fetchItems } from "../../../graphql/items/fetcher"

export type Price = {
    id: string
    name: string
    icon: string | undefined
    divineValue: number
    chaosValue: number
}

export const priceRouter = router({
    prices: publicProcedure
        .input(z.object({ text: z.string().nullish() }).nullish())
        .query(({ input }) => {
            return {
                greeting: `Hello ${input?.text ?? "world"}`,
            }
        }),
    list: publicProcedure
        .input(z.object({ ids: z.array(z.string()) }))
        .query(async ({ input: { ids } }) => {
            // each id will only produce a single result
            const matchesByItemId: Record<string, Price> = {}

            const currencies = await fetchCurrencies("tmpstandard")
            for (const currency of currencies) {
                const match = ids.find((itemId) => itemId === currency.currencyTypeName)
                if (match) {
                    matchesByItemId[match] = {
                        id: currency.currencyTypeName,
                        name: currency.currencyTypeName,
                        icon: currency.icon,
                        chaosValue: currency.chaosValue,
                        divineValue: currency.divineValue,
                    }
                }
            }

            const items = await fetchItems("tmpstandard")

            for (const item of items) {
                const match = ids.find((itemId) => itemId === item.detailsId)
                if (match) {
                    matchesByItemId[match] = {
                        id: item.detailsId,
                        name: item.name,
                        icon: item.icon,
                        chaosValue: item.chaosValue,
                        divineValue: item.divineValue,
                    }
                }
            }

            return matchesByItemId
        }),
})
