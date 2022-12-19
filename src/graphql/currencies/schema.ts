// load all mingo operators
import "mingo/init/system"
import { Aggregator } from "mingo"

import { fetchCurrencies } from "./fetcher"
import { builder } from "../builder"
import { StringFilter, NumberFilter } from "../../utils/filters"

builder.objectType("Currency", {
    fields: (t) => ({
        id: t.exposeID("id"),
        name: t.exposeString("name"),
        icon: t.exposeString("icon", { nullable: true }),
        chaosValue: t.exposeFloat("chaosValue"),
        divineValue: t.exposeFloat("divineValue"),
    }),
})

const CurrencyWhereInput = builder.inputType("CurrencyWhereInput", {
    fields: (t) => ({
        name: t.field({ type: StringFilter, required: false }),
        chaosValue: t.field({ type: NumberFilter, required: false }),
        divineValue: t.field({ type: NumberFilter, required: false }),
    }),
})

builder.queryType({
    fields: (t) => ({
        currencies: t.field({
            type: ["Currency"],
            args: {
                where: t.arg({ type: CurrencyWhereInput, required: false }),
            },
            resolve: async (_, args) => {
                const agg = new Aggregator([
                    { $match: { name: { $regex: args.where?.name?._eq } } },
                ])

                const currencies = await fetchCurrencies()
                return agg.run(currencies) as unknown as typeof currencies
            },
        }),
    }),
})
