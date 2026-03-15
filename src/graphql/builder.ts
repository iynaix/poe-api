import SchemaBuilder from "@pothos/core"
import type { Currency } from "./exchange/types"
import type { Item } from "./stash/types"
import type { ExplicitModifier } from "./stash/ninja_types"
import type { Combined } from "./combined/types"
import { EXCHANGE_ENDPOINTS, STASH_ENDPOINTS } from "../utils/constants"

export const builder = new SchemaBuilder<{
    Objects: {
        Currency: Currency
        Item: Item
        ItemModifier: ExplicitModifier
        Combined: Combined
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
