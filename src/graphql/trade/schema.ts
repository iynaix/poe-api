import { builder } from "../builder"

const fetchPoeUrl = async (url: string, poeSessionId: string, fetchOptions: RequestInit = {}) => {
    const { headers, ...other } = fetchOptions
    const res = await fetch(url, {
        ...other,
        headers: { ...headers, cookie: `POESESSID=${poeSessionId}` },
    })
    return res.text()
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const postPoeUrl = async (url: string, poeSessionId: string, payload: any) => {
    const text = await fetchPoeUrl(url, poeSessionId, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
    })
    return JSON.parse(text)
}

const getTradeUrlInfo = (url: string) => {
    const parts = url.split("/")
    return {
        leagueName: parts[parts.indexOf("search") + 1],
        searchId: parts[parts.length - 1],
    }
}

const getQueryState = (content: string) => {
    // search for matching opening and closing braces
    let openBraces = 1
    let closeBraces = 0
    let idx = 0

    for (const c of content) {
        if (c === "{") {
            openBraces++
        } else if (c === "}") {
            closeBraces++
        }

        if (openBraces === closeBraces) {
            break
        }

        idx++
    }

    try {
        return JSON.parse(`{${content.substring(0, idx + 1)}`)
    } catch (error) {
        return undefined
    }
}

type PoeTradeItem = {
    id: string
    listing: {
        price: {
            amount: number
            currency: string
        }
    }
}

builder.queryFields((t) => ({
    trade: t.field({
        type: "String",
        args: {
            url: t.arg.string({ required: true }),
            poeSessionId: t.arg.string({ required: true }),
        },
        resolve: async (_, { poeSessionId, url }) => {
            const { leagueName, searchId } = getTradeUrlInfo(url)

            const tradeHtml = await fetchPoeUrl(url, poeSessionId)

            // look for a state js object to send for item results
            const results = tradeHtml.split(/"state":\s+\{/)
            if (results.length < 2) {
                return "not found"
            }

            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            const queryState = getQueryState(results[1]!)

            if (!queryState) {
                throw Error("Unable to parse search query from url")
            }

            const { result: itemIds }: { result: string[] } = await postPoeUrl(
                `https://www.pathofexile.com/api/trade/search/${leagueName}`,
                poeSessionId,
                {
                    query: queryState,
                    sort: {
                        price: "asc",
                    },
                }
            )

            const itemsRes = await fetchPoeUrl(
                `https://www.pathofexile.com/api/trade/fetch/${itemIds
                    .slice(0, 10)
                    .join(",")}?query=${searchId}`,
                poeSessionId,
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            )
            const items = JSON.parse(itemsRes).result as PoeTradeItem[]

            items.forEach((item) => {
                console.log(`${item.listing.price.amount} ${item.listing.price.currency}`)
            })

            return "trade"
        },
    }),
}))
