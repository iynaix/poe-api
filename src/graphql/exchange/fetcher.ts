import pThrottle from "p-throttle"
import type { LeagueName } from "../../utils"
import { truncateFloat, fetchNinja } from "../../utils"
import { cachedLeagueData } from "../../utils/cache"
import type { ExchangeEndpointEnum } from "../../utils/constants"
import { EXCHANGE_ENDPOINTS } from "../../utils/constants"
import type { NinjaExchange } from "./ninja_types"
import type { Currency, LineWithChaos } from "./types"

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

            if (!item.image) {
                console.log("no image", item)
            }

            return {
                ...item,
                ...line,
                chaosValue: line.primaryValue,
                divineValue: line.primaryValue / DIVINE_VALUE,
            }
        }) as Currency[]
}

// fetches and returns the currencies
export const fetchExchanges = async (league: LeagueName = "tmpstandard") =>
    cachedLeagueData<Currency[]>("/tmp/__cache__currencies.json", league, async () => {
        let CURRENCIES: Currency[] = []

        const throttle = pThrottle({ limit: 5, interval: 1000 })
        const throttledFetch = throttle(fetchExchangeEndpoint)

        await Promise.all(
            EXCHANGE_ENDPOINTS.map(async (endpoint) => {
                const fetchedCurrencies = await throttledFetch(endpoint, league)
                CURRENCIES = CURRENCIES.concat(fetchedCurrencies)
            })
        )

        return CURRENCIES.map((item) => ({
            ...item,
            divineValue: truncateFloat(item.chaosValue / DIVINE_VALUE, 3),
        }))
    })
