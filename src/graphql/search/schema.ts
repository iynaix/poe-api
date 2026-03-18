import { Aggregator } from "mingo"

import { builder, League } from "../builder"
import { StringFilter, createWhere } from "../../utils/filters"
import { createOrderBy } from "../../utils/orderby"
import { fetchSearch, type SearchResultWithEndpoint } from "./fetcher"

builder.objectType("Search", {
    fields: (t) => ({
        name: t.exposeString("name"),
        icon: t.exposeString("icon", { nullable: true }),
        endpoint: t.exposeString("endpoint"),
    }),
})

const [whereInput, whereAgg] = createWhere("SearchWhereInput", {
    name: StringFilter,
    icon: StringFilter,
})

const [orderBy, orderByAgg] = createOrderBy("SearchOrderBy", ["name"])

builder.queryFields((t) => ({
    search: t.field({
        type: ["Search"],
        args: {
            league: t.arg({ type: League, required: false, defaultValue: "tmpstandard" }),
            where: t.arg({ type: whereInput, required: false }),
            orderBy: t.arg({ type: orderBy, required: false }),
        },
        resolve: async (_, args) => {
            const results = await fetchSearch(args.league || "tmpstandard")

            const $match = whereAgg(args.where)
            const $sort = orderByAgg(args.orderBy)

            // console.log("$match", $match)
            const agg = new Aggregator([{ $match }, { $sort }])

            return agg.run(results) as unknown as SearchResultWithEndpoint[]
        },
    }),
}))
