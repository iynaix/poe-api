import { Aggregator } from "mingo"

import { builder, LeagueEnum } from "../builder"
import { fetchCurrencies } from "../currencies/fetcher"
import { fetchItems } from "../items/fetcher"
import { StringFilter, NumberFilter, createWhere } from "../../utils/filters"
import { createOrderBy } from "../../utils/orderby"
import { Combined } from "./types"

builder.objectType("Combined", {
    fields: (t) => ({
        id: t.exposeID("id"),
        name: t.exposeString("name"),
        icon: t.exposeString("icon", { nullable: true }),
        chaosValue: t.exposeFloat("chaosValue"),
        divineValue: t.exposeFloat("divineValue"),
        endpoint: t.exposeString("endpoint"),
    }),
})

const [whereInput, whereAgg] = createWhere("CombinedWhereInput", {
    name: StringFilter,
    chaosValue: NumberFilter,
    divineValue: NumberFilter,
})

const [orderBy, orderByAgg] = createOrderBy("CombinedOrderBy", [
    "name",
    "chaosValue",
    "divineValue",
])

builder.queryFields((t) => ({
    combined: t.field({
        type: ["Combined"],
        args: {
            league: t.arg({ type: LeagueEnum, required: false, defaultValue: "tmpstandard" }),
            where: t.arg({ type: whereInput, required: false }),
            orderBy: t.arg({ type: orderBy, required: false }),
        },
        resolve: async (_, args) => {
            const currencies = await fetchCurrencies(args.league || "tmpstandard")
            const items = await fetchItems(args.league || "tmpstandard")

            const all: Combined[] = [
                // overwrite id with currencyTypeName
                ...currencies.map(({ currencyTypeName, ...currency }) => ({
                    ...currency,
                    id: currencyTypeName,
                })),
                // overwrite id with detailsId
                ...items.map(({ detailsId, ...item }) => ({
                    ...item,
                    id: detailsId,
                })),
            ]

            const $match = whereAgg(args.where)
            const $sort = orderByAgg(args.orderBy)

            // console.log("$match", $match)
            const agg = new Aggregator([{ $match }, { $sort }])

            return agg.run(all) as unknown as typeof all
        },
    }),
}))