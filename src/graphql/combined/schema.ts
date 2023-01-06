import { Aggregator } from "mingo"

import { builder, League } from "../builder"
import { fetchCurrencies } from "../currencies/fetcher"
import { fetchItems } from "../items/fetcher"
import { StringFilter, FloatFilter, createWhere } from "../../utils/filters"
import { createOrderBy } from "../../utils/orderby"
import type { LeagueName } from "../../utils"
import type { Combined } from "./types"
import { CHAOS_ICON } from "../../components/poe_icon"

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
    chaosValue: FloatFilter,
    divineValue: FloatFilter,
})

const [orderBy, orderByAgg] = createOrderBy("CombinedOrderBy", [
    "name",
    "chaosValue",
    "divineValue",
])

export const fetchCombined = async (league: LeagueName = "tmpstandard") => {
    const currencies = await fetchCurrencies(league)
    const items = await fetchItems(league)
    // placeholder value, updated below
    let divineValue = 1

    // overwrite id with currencyTypeName
    const processedCurrencies = currencies.map(({ currencyTypeName, ...currency }) => {
        if (currencyTypeName === "Divine Orb") {
            divineValue = currency.chaosValue
        }

        return {
            id: currencyTypeName,
            name: currency.name,
            icon: currency.icon,
            chaosValue: currency.chaosValue,
            divineValue: currency.divineValue,
            endpoint: currency.endpoint,
        }
    })

    // overwrite id with detailsId
    const processedItems = items.map(({ detailsId, ...item }) => ({
        id: detailsId,
        name: item.name,
        icon: item.icon,
        chaosValue: item.chaosValue,
        divineValue: item.divineValue,
        endpoint: item.endpoint,
    }))

    return [
        ...processedCurrencies,
        // add a chaos orb item
        {
            id: "Chaos Orb",
            name: "Chaos Orb",
            icon: CHAOS_ICON,
            chaosValue: 1,
            divineValue: 1 / divineValue,
            endpoint: "currency",
        },
        ...processedItems,
    ] as Combined[]
}

builder.queryFields((t) => ({
    combined: t.field({
        type: ["Combined"],
        args: {
            league: t.arg({ type: League, required: false, defaultValue: "tmpstandard" }),
            where: t.arg({ type: whereInput, required: false }),
            orderBy: t.arg({ type: orderBy, required: false }),
        },
        resolve: async (_, args) => {
            const combined = await fetchCombined(args.league || "tmpstandard")

            const $match = whereAgg(args.where)
            const $sort = orderByAgg(args.orderBy)

            // console.log("$match", $match)
            const agg = new Aggregator([{ $match }, { $sort }])

            return agg.run(combined) as unknown as Combined[]
        },
    }),
}))
