import pThrottle from "p-throttle"
import type { LeagueName } from "../../utils"
import { truncateFloat, fetchNinja } from "../../utils"
import { cachedLeagueData } from "../../utils/cache"
import type { CurrencyEndpointEnum } from "../../utils/constants"
import { CURRENCY_ENDPOINTS } from "../../utils/constants"
import type { NinjaCurrencies } from "./ninja_types"
import type { Currency, LineWithChaos } from "./types"

let DIVINE_VALUE = 0

export const fetchCurrencyEndpoint = async (endpoint: CurrencyEndpointEnum, league: LeagueName) => {
    const { currencyDetails, lines } = await fetchNinja<NinjaCurrencies>(endpoint, league)

    const linesByType: Record<string, LineWithChaos> = {}
    lines.forEach((line) => {
        const { currencyTypeName, chaosEquivalent } = line
        linesByType[currencyTypeName] = { ...line, chaosValue: chaosEquivalent, endpoint }
        if (currencyTypeName === "Divine Orb") {
            DIVINE_VALUE = chaosEquivalent
        }
    })

    return currencyDetails
        .filter(({ name }) => name in linesByType)
        .map((item) => {
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            const line = linesByType[item.name]!
            return {
                ...item,
                // fill with zero first, actual value is added below
                divineValue: 0,
                ...line,
                id: item.tradeId ?? line.detailsId,
            }
        })
}

// fetches and returns the currencies
export const fetchCurrencies = async (league: LeagueName = "tmpstandard") =>
    cachedLeagueData<Currency[]>("/tmp/__cache__currencies.json", league, async () => {
        let CURRENCIES: Currency[] = []

        const throttle = pThrottle({ limit: 5, interval: 1000 })
        const throttledFetch = throttle(fetchCurrencyEndpoint)

        await Promise.all(
            CURRENCY_ENDPOINTS.map(async (endpoint) => {
                const fetchedCurrencies = await throttledFetch(endpoint, league)

                // @ts-expect-error fixed in the following map
                CURRENCIES = CURRENCIES.concat(fetchedCurrencies)
            })
        )

        return CURRENCIES.map((item) => ({
            ...item,
            divineValue: truncateFloat(item.chaosValue / DIVINE_VALUE, 3),
        }))
    })
