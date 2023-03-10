import SchemaBuilder from "@pothos/core"
import type { Currency } from "./currencies/types"
import type { Item } from "./items/types"
import type { ExplicitModifier } from "./items/ninja_types"
import type { Combined } from "./combined/types"
import { CURRENCY_ENDPOINTS, ITEM_ENDPOINTS } from "../utils/constants"

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
    values: CURRENCY_ENDPOINTS,
})

export const ItemEndpoint = builder.enumType("ItemEndpoint", {
    values: ITEM_ENDPOINTS,
})
