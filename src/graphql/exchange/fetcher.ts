import pThrottle from "p-throttle"
import type { LeagueName } from "../../utils"
import { truncateFloat, fetchNinja } from "../../utils"
import { cachedLeagueData } from "../../utils/cache"
import type { ExchangeEndpointEnum } from "../../utils/constants"
import { EXCHANGE_ENDPOINTS } from "../../utils/constants"
import type { NinjaExchange } from "./ninja_types"
import type { Exchange, LineWithChaos } from "./types"

let DIVINE_VALUE = 0

export const fetchExchangeEndpoint = async (endpoint: ExchangeEndpointEnum, league: LeagueName) => {
    const { core, items, lines } = await fetchNinja<NinjaExchange>(endpoint, league)

    const linesByType: Record<string, LineWithChaos> = {}
    lines.forEach((line) => {
        linesByType[line.id] = { ...line, endpoint }
    })

    DIVINE_VALUE = 1.0 / core.rates.divine

    return items
        .filter(({ id }) => id in linesByType)
        .map((item) => {
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            const line = linesByType[item.id]!

            // div cards don't send an image
            if (endpoint === "DivinationCard") {
                item.image =
                    "https://web.poecdn.com/image/Art/2DItems/Divination/InventoryIcon.png?scale=1&w=1&h=1"
            }

            if (!item.image) {
                console.error("no image", item)
            }

            return {
                ...item,
                ...line,
                chaosValue: line.primaryValue,
                divineValue: line.primaryValue / DIVINE_VALUE,
            }
        }) as Exchange[]
}

// fetches and returns the currencies
export const fetchExchanges = async (league: LeagueName = "tmpstandard") =>
    cachedLeagueData<Exchange[]>("/tmp/__cache__currencies.json", league, async () => {
        let EXCHANGES: Exchange[] = []

        const throttle = pThrottle({ limit: 5, interval: 1000 })
        const throttledFetch = throttle(fetchExchangeEndpoint)

        await Promise.all(
            EXCHANGE_ENDPOINTS.map(async (endpoint) => {
                try {
                    const fetchedExchange = await throttledFetch(endpoint, league)
                    EXCHANGES = EXCHANGES.concat(fetchedExchange)
                } catch (err) {
                    console.error(`Failed to fetch from ${endpoint} (exchange):`, err)
                }
            })
        )

        return EXCHANGES.map((item) => ({
            ...item,
            divineValue: truncateFloat(item.chaosValue / DIVINE_VALUE, 3),
        }))
    })
