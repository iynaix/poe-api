import SchemaBuilder from "@pothos/core"
import { Currency } from "./currencies/types"
import { Item } from "./items/types"
import { ExplicitModifier } from "./items/ninja_types"
import { Combined } from "./combined/types"

export const builder = new SchemaBuilder<{
    Objects: {
        Currency: Currency
        Item: Item
        ItemModifier: ExplicitModifier
        Combined: Combined
    }
}>({})

export const LeagueEnum = builder.enumType("League", {
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
