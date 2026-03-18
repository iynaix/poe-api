import { z } from "zod"

import { router, publicProcedure } from "../trpc"
import {
    type ExchangeEndpointEnum,
    type StashEndpointEnum,
    EXCHANGE_ENDPOINTS,
    LEAGUES,
} from "../../../utils/constants"
import type { LeagueName } from "../../../utils"
import { fetchExchangeEndpoint, fetchExchanges } from "../../../graphql/exchange/fetcher"
import { fetchStash, fetchStashEndpoint } from "../../../graphql/stash/fetcher"
import { CHAOS_ICON } from "../../../components/poe_icon"
import { fetchSearch, type SearchResultWithEndpoint } from "../../../graphql/search/fetcher"

export type Price = {
    id: string
    name: string
    icon?: string
    divineValue: number
    chaosValue: number
    endpoint: ExchangeEndpointEnum | StashEndpointEnum
}

const fetchPrices = async (league: LeagueName = "tmpstandard") => {
    const currencies = await fetchExchanges(league)
    const items = await fetchStash(league)
    // placeholder value, updated below
    let divineValue = 1

    // overwrite id with currencyTypeName
    const processedCurrencies = currencies.map(({ id, ...currency }) => {
        if (id === "divine") {
            divineValue = currency.chaosValue
        }

        return {
            id,
            name: currency.name,
            icon: currency.image,
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
    searchByName: publicProcedure
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
        .query(async ({ input: { query, league } }): Promise<SearchResultWithEndpoint[]> => {
            if (!query || query.length < 3) return []

            const re = new RegExp(query.replace(" ", ".*"), "i")
            const results = await fetchSearch((league as keyof typeof LEAGUES) || "tmpstandard")

            return results.filter((result) => re.test(result.name))
        }),
    priceByName: publicProcedure
        .input(
            z.object({
                name: z.string(),
                league: z
                    .string()
                    .optional()
                    .refine((s) => (s ? s.toLowerCase() in LEAGUES : true), {
                        message: "League is invalid",
                    }),
                endpoint: z.string(),
            })
        )
        .query(async ({ input: { name, league, endpoint } }): Promise<Price | undefined> => {
            const resolvedLeague: LeagueName = (league as keyof typeof LEAGUES) || "tmpstandard"

            // @ts-expect-error cannot check string against enum
            if (EXCHANGE_ENDPOINTS.includes(endpoint)) {
                // fetch exchange
                const exchanges = await fetchExchangeEndpoint(
                    endpoint as ExchangeEndpointEnum,
                    resolvedLeague
                )
                return exchanges
                    .filter((exchange) => name == exchange.name)
                    .map((exchange) => {
                        return {
                            id: exchange.id,
                            name: exchange.name,
                            icon: exchange.image,
                            chaosValue: exchange.chaosValue,
                            divineValue: exchange.divineValue,
                            endpoint: exchange.endpoint,
                        } as Price
                    })[0]
            } else {
                // fetch stash
                const stashes = await fetchStashEndpoint(
                    endpoint as StashEndpointEnum,
                    resolvedLeague
                )
                return stashes
                    .filter((stash) => name == stash.name)
                    .map((stash) => {
                        return {
                            id: stash.id,
                            name: stash.name,
                            icon: stash.icon,
                            chaosValue: stash.chaosValue,
                            divineValue: stash.divineValue,
                            endpoint: stash.endpoint,
                        } as Price
                    })[0]
            }
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

            const resolvedLeague: LeagueName = (league as keyof typeof LEAGUES) || "tmpstandard"
            const searchResults = await fetchSearch(resolvedLeague)
            const resultsByEndpoint = Object.groupBy(
                searchResults.filter((result) => ids.includes(result.name)),
                (result) => result.endpoint
            )

            // get prices for each endpoint
            for (const endpoint in resultsByEndpoint) {
                // @ts-expect-error cannot check string against enum
                if (EXCHANGE_ENDPOINTS.includes(endpoint)) {
                    // fetch exchange
                    const exchanges = await fetchExchangeEndpoint(
                        endpoint as ExchangeEndpointEnum,
                        resolvedLeague
                    )
                    exchanges
                        .filter((exchange) => ids.includes(exchange.name))
                        .forEach((exchange) => {
                            matchesByItemId[exchange.name] = {
                                id: exchange.id,
                                name: exchange.name,
                                icon: exchange.image,
                                chaosValue: exchange.chaosValue,
                                divineValue: exchange.divineValue,
                                endpoint: exchange.endpoint,
                            }
                        })
                } else {
                    // fetch stash
                    const stashes = await fetchStashEndpoint(
                        endpoint as StashEndpointEnum,
                        resolvedLeague
                    )
                    stashes
                        .filter((stash) => ids.includes(stash.name))
                        .forEach((stash) => {
                            matchesByItemId[stash.name] = {
                                id: stash.id,
                                name: stash.name,
                                icon: stash.icon,
                                chaosValue: stash.chaosValue,
                                divineValue: stash.divineValue,
                                endpoint: stash.endpoint,
                            }
                        })
                }
            }
            return matchesByItemId
        }),
})
