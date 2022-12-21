import { Aggregator } from "mingo"

import { fetchCurrencies, fetchCurrencyEndpoint } from "./fetcher"
import { builder, League, CurrencyEndpoint } from "../builder"
import { StringFilter, NumberFilter, createWhere, EnumFilter } from "../../utils/filters"
import { createOrderBy } from "../../utils/orderby"

builder.objectType("Currency", {
    fields: (t) => ({
        id: t.exposeID("currencyTypeName"),
        name: t.exposeString("name"),
        icon: t.exposeString("icon", { nullable: true }),
        chaosValue: t.exposeFloat("chaosValue"),
        divineValue: t.exposeFloat("divineValue"),
        endpoint: t.exposeString("endpoint"),
    }),
})

const [whereInput, whereAgg] = createWhere("CurrencyWhereInput", {
    name: StringFilter,
    chaosValue: NumberFilter,
    divineValue: NumberFilter,
    endpoint: EnumFilter("CurrencyEndpoint", CurrencyEndpoint),
})

const [orderBy, orderByAgg] = createOrderBy("CurrencyOrderBy", [
    "name",
    "chaosValue",
    "divineValue",
])

builder.queryFields((t) => ({
    currencies: t.field({
        type: ["Currency"],
        args: {
            league: t.arg({ type: League, required: false, defaultValue: "tmpstandard" }),
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
    divineValue: t.field({
        type: "Float",
        resolve: async () => {
            const currencies = await fetchCurrencyEndpoint("Currency", "tmpstandard")

            const divineOrb = currencies.find(
                (currency) => currency.currencyTypeName === "Divine Orb"
            )

            if (!divineOrb?.chaosValue) {
                throw new Error("Divine Orb not found")
            }

            return divineOrb.chaosValue
        },
    }),
}))
