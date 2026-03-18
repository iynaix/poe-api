import SchemaBuilder from "@pothos/core"
import type { Exchange } from "./exchange/types"
import type { Stash } from "./stash/types"
import type { ExplicitModifier } from "./stash/ninja_types"
import type { Combined } from "./combined/types"
import { EXCHANGE_ENDPOINTS, STASH_ENDPOINTS } from "../utils/constants"
import type { SearchResultWithEndpoint } from "./search/fetcher"

export const builder = new SchemaBuilder<{
    Objects: {
        Currency: Exchange
        Item: Stash
        ItemModifier: ExplicitModifier
        Combined: Combined
        Search: SearchResultWithEndpoint
    }
}>({})

export const League = builder.enumType("League", {
    values: [
        "tmpstandard",
        "tmpruthless",
        "tmphardcore",
        "tmphardcoreruthless",
        "standard",
        "hardcore",
        "ruthless",
        "hardcoreruthless",
    ] as const,
})

export const CurrencyEndpoint = builder.enumType("CurrencyEndpoint", {
    values: EXCHANGE_ENDPOINTS,
})

export const ItemEndpoint = builder.enumType("ItemEndpoint", {
    values: STASH_ENDPOINTS,
})
