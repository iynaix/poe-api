import SchemaBuilder from "@pothos/core"
import { fetchCurrencies } from "./currencies/fetcher"
import { Currency } from "./currencies/types"

// load all mingo operators
import "mingo/init/system"
import { Aggregator } from "mingo"

const builder = new SchemaBuilder<{
    Objects: {
        Currency: Currency
    }
}>({})

builder.objectType("Currency", {
    fields: (t) => ({
        id: t.exposeID("id"),
        name: t.exposeString("name"),
        icon: t.exposeString("icon", { nullable: true }),
        chaosValue: t.exposeFloat("chaosValue"),
        divineValue: t.exposeFloat("divineValue"),
    }),
})

builder.queryType({
    fields: (t) => ({
        currencies: t.field({
            type: ["Currency"],
            args: {
                name: t.arg.string({ required: false }),
            },
            resolve: async (root, args) => {
                const agg = new Aggregator([{ $match: { name: { $regex: args.name } } }])

                const currencies = await fetchCurrencies()
                return agg.run(currencies) as unknown as typeof currencies
            },
        }),
    }),
})

export const schema = builder.toSchema()
