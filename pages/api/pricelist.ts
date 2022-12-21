import type { NextApiRequest, NextApiResponse } from "next"
import { fetchCurrencies } from "../../src/graphql/currencies/fetcher"
import { fetchItems } from "../../src/graphql/items/fetcher"
import { Currency } from "../../src/graphql/currencies/types"
import { Item } from "../../src/graphql/items/types"

// TODO: customizable league?
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const rawItems = req.query?.items
    let itemIds: string[] = []

    if (!rawItems) {
        res.status(400).json({ error: "No items provided" })
        return
    }

    if (typeof rawItems === "string") {
        itemIds = rawItems.split(",")
    } else {
        itemIds = rawItems.flatMap((rawItem) => rawItem.split(","))
    }

    const matchesByItemId: Record<string, Currency | Item> = {}

    const currencies = await fetchCurrencies("tmpstandard")
    for (const currency of currencies) {
        const match = itemIds.find((itemId) => itemId === currency.currencyTypeName)
        if (match) {
            matchesByItemId[match] = currency
        }
    }

    const items = await fetchItems("tmpstandard")

    for (const item of items) {
        const match = itemIds.find((itemId) => itemId === item.detailsId)
        if (match) {
            matchesByItemId[match] = item
        }
    }

    return res.status(200).json(
        itemIds.map((itemId) => {
            const item = matchesByItemId[itemId]

            return { Name: item.name, Chaos: item.chaosValue, Divine: item.divineValue }
        })
    )
}
