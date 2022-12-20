import { Aggregator } from "mingo"

import { fetchItems } from "./fetcher"
import { builder, LeagueEnum } from "../builder"
import { StringFilter, NumberFilter, createWhere } from "../../utils/filters"
import { createOrderBy } from "../../utils/orderby"

builder.objectType("ItemModifier", {
    fields: (t) => ({
        text: t.exposeString("text"),
        optional: t.exposeBoolean("optional"),
    }),
})

builder.objectType("Item", {
    fields: (t) => ({
        id: t.exposeID("detailsId"),
        name: t.exposeString("name"),
        icon: t.exposeString("icon", { nullable: true }),
        chaosValue: t.exposeFloat("chaosValue"),
        divineValue: t.exposeFloat("divineValue"),
        levelRequired: t.exposeInt("levelRequired", { nullable: true }),
        baseType: t.exposeString("baseType", { nullable: true }),
        // itemClass: t.exposeInt("itemClass", { nullable: true }),
        itemType: t.exposeString("itemType", { nullable: true }),
        // count: t.exposeInt("count"),
        endpoint: t.exposeString("endpoint"),
        links: t.exposeInt("links", { nullable: true }),
        variant: t.exposeString("variant", { nullable: true }),
        // modfiers
        implicitModifiers: t.field({
            type: ["ItemModifier"],
            resolve: (parent) => parent.implicitModifiers,
        }),
        explicitModifiers: t.field({
            type: ["ItemModifier"],
            resolve: (parent) => parent.explicitModifiers,
        }),
    }),
})

const [whereInput, whereAgg] = createWhere("ItemWhereInput", {
    name: StringFilter,
    chaosValue: NumberFilter,
    divineValue: NumberFilter,
    levelRequired: NumberFilter,
    baseType: StringFilter,
    itemType: StringFilter,
    links: NumberFilter,
    variant: StringFilter,
    // TODO: implicit and explicit modifiers
    // TODO: endpoint?
    // TODO: low confidence filter?
})

const [orderBy, orderByAgg] = createOrderBy("ItemOrderBy", [
    "name",
    "chaosValue",
    "divineValue",
    "levelRequired",
    "baseType",
    "itemType",
    "links",
    "variant",
])

builder.queryFields((t) => ({
    items: t.field({
        type: ["Item"],
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

            const items = await fetchItems(args.league || "tmpstandard")
            return agg.run(items) as unknown as typeof items
        },
    }),
}))
