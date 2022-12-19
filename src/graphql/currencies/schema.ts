// load all mingo operators
import "mingo/init/system"
import { Aggregator } from "mingo"

import { fetchCurrencies } from "./fetcher"
import { builder, LeagueEnum } from "../builder"
import { StringFilter, NumberFilter, createWhere } from "../../utils/filters"
import { createOrderBy } from "../../utils/orderby"

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

const [orderBy, orderByAgg] = createOrderBy("CurrencyOrderBy", [
    "name",
    "chaosValue",
    "divineValue",
])

builder.queryType({
    fields: (t) => ({
        currencies: t.field({
            type: ["Currency"],
            args: {
                league: t.arg({ type: LeagueEnum, required: false }),
                where: t.arg({ type: whereInput, required: false }),
                orderBy: t.arg({ type: orderBy, required: false }),
            },
            resolve: async (_, args) => {
                const $match = whereAgg(args.where)
                const $sort = orderByAgg(args.orderBy)

                // console.log("$match", $match)
                const agg = new Aggregator([{ $match }, { $sort }])

                const currencies = await fetchCurrencies(args.league || "tmpstandard")
                return agg.run(currencies) as unknown as typeof currencies
            },
        }),
    }),
})
