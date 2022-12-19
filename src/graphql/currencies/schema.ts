// load all mingo operators
import "mingo/init/system"
import { Aggregator } from "mingo"

import { fetchCurrencies } from "./fetcher"
import { builder } from "../builder"
import { StringFilter, NumberFilter, createWhere } from "../../utils/filters"

builder.objectType("Currency", {
    fields: (t) => ({
        id: t.exposeID("id"),
        name: t.exposeString("name"),
        icon: t.exposeString("icon", { nullable: true }),
        chaosValue: t.exposeFloat("chaosValue"),
        divineValue: t.exposeFloat("divineValue"),
    }),
})

const [whereInput, whereAgg] = createWhere("CurrencyWhereInput", {
    name: StringFilter,
    chaosValue: NumberFilter,
    divineValue: NumberFilter,
})

builder.queryType({
    fields: (t) => ({
        currencies: t.field({
            type: ["Currency"],
            args: {
                where: t.arg({ type: whereInput, required: false }),
            },
            resolve: async (_, args) => {
                const $match = whereAgg(args.where)
                const agg = new Aggregator([{ $match: $match }])

                const currencies = await fetchCurrencies()
                return agg.run(currencies) as unknown as typeof currencies
            },
        }),
    }),
})
