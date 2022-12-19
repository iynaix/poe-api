import SchemaBuilder from "@pothos/core"
import { Currency } from "./currencies/types"

export const builder = new SchemaBuilder<{
    Objects: {
        Currency: Currency
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
