import type { NextApiRequest, NextApiResponse } from "next"
import { fetchCurrencies } from "../../../src/graphql/currencies/fetcher"
import { fetchItems } from "../../../src/graphql/items/fetcher"

// TODO: customizable league?
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    let { combinedId } = req.query
    const currencies = await fetchCurrencies("tmpstandard")

    if (combinedId === "divine") {
        combinedId = "Divine Orb"
    }

    for (const currency of currencies) {
        if (currency.currencyTypeName === combinedId) {
            res.status(200).json(currency.chaosValue)
            return
        }
    }

    const items = await fetchItems("tmpstandard")

    for (const item of items) {
        if (item.detailsId === combinedId) {
            res.status(200).json(item.chaosValue)
            return
        }
    }

    res.status(404).json({ error: "Not found" })
    return
}
