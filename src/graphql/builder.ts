import SchemaBuilder from "@pothos/core"
import { Currency } from "./currencies/types"
import { Item } from "./items/types"
import { ExplicitModifier } from "./items/ninja_types"

export const builder = new SchemaBuilder<{
    Objects: {
        Currency: Currency
        Item: Item
        ItemModifier: ExplicitModifier
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
