import { z } from "zod"
import { orderBy } from "lodash"

import { router, publicProcedure } from "../trpc"
import { type CurrencyEndpointEnum, type ItemEndpointEnum, LEAGUES } from "../../../utils/constants"
import type { LeagueName } from "../../../utils"
import { fetchCurrencies } from "../../../graphql/currencies/fetcher"
import { fetchItems } from "../../../graphql/items/fetcher"
import { CHAOS_ICON } from "../../../components/poe_icon"

export type Price = {
    id: string
    name: string
    icon?: string
    divineValue: number
    chaosValue: number
    endpoint: CurrencyEndpointEnum | ItemEndpointEnum
}

const fetchPrices = async (league: LeagueName = "tmpstandard") => {
    const currencies = await fetchCurrencies(league)
    const items = await fetchItems(league)
    // placeholder value, updated below
    let divineValue = 1

    // overwrite id with currencyTypeName
    const processedCurrencies = currencies.map(({ currencyTypeName, ...currency }) => {
        if (currencyTypeName === "Divine Orb") {
            divineValue = currency.chaosValue
        }

        return {
            id: currency.id,
            name: currency.name,
            icon: currency.icon,
            chaosValue: currency.chaosValue,
            divineValue: currency.divineValue,
            endpoint: currency.endpoint,
        }
    })

    // overwrite id with detailsId
    const processedItems = items.map(({ detailsId, ...item }) => {
        return {
            id: detailsId,
            name: item.name,
            icon: item.icon,
            chaosValue: item.chaosValue,
            divineValue: item.divineValue,
            endpoint: item.endpoint,
        }
    })

    return [
        ...processedCurrencies,
        // add a chaos orb item
        {
            id: "chaos",
            name: "Chaos Orb",
            icon: CHAOS_ICON,
            chaosValue: 1,
            divineValue: 1 / divineValue,
            endpoint: "currency",
        },
        ...processedItems,
    ] as Price[]
}

export const priceRouter = router({
    byName: publicProcedure
        .input(
            z.object({
                query: z.string(),
                league: z
                    .string()
                    .optional()
                    .refine((s) => (s ? s.toLowerCase() in LEAGUES : true), {
                        message: "League is invalid",
                    }),
            })
        )
        .query(async ({ input: { query, league } }): Promise<Price[]> => {
            if (!query || query.length < 3) return []

            const re = new RegExp(query.replace(" ", ".*"), "i")
            const prices = await fetchPrices((league as keyof typeof LEAGUES) || "tmpstandard")

            const filteredPrices = prices.filter((price) => re.test(price.name))
            return orderBy(filteredPrices, (price) => price.chaosValue, "desc")
        }),
    list: publicProcedure
        .input(
            z.object({
                ids: z.array(z.string()),
                league: z
                    .string()
                    .optional()
                    .refine((s) => (s ? s.toLowerCase() in LEAGUES : true), {
                        message: "League is invalid",
                    }),
            })
        )
        .query(async ({ input: { ids, league } }): Promise<Record<string, Price>> => {
            // each id will only produce a single result
            const matchesByItemId: Record<string, Price> = {}

            const prices = await fetchPrices((league as keyof typeof LEAGUES) || "tmpstandard")
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
