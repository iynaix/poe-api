import { timestamp, truncateFloat, LeagueName, fetchNinja } from "../../utils"
import { CURRENCY_ENDPOINTS, CACHE_THRESHOLD } from "../../utils/constants"
import { NinjaCurrencies } from "./ninja_types"
import { Currency, LineWithChaos } from "./types"

export let CURRENCY_LAST_FETCHED: number | undefined = undefined
export let DIVINE_VALUE = 0
export let CURRENCIES: Currency[] = []

// fetches and returns the currencies
export const fetchCurrencies = async (league: LeagueName = "tmpstandard") => {
    const fetchTime = timestamp()

    // use cache if below threshold
    if (CURRENCY_LAST_FETCHED && fetchTime - CURRENCY_LAST_FETCHED < CACHE_THRESHOLD) {
        return CURRENCIES
    }

    console.log(`Fetching currencies from poe.ninja... (${fetchTime})`)

    CURRENCY_LAST_FETCHED = fetchTime
    CURRENCIES = []

    await Promise.all(
        CURRENCY_ENDPOINTS.map(async (endpoint) => {
            const { currencyDetails, lines } = await fetchNinja<NinjaCurrencies>(endpoint, league)

            const linesByType: Record<string, LineWithChaos> = {}
            lines.forEach((line) => {
                const { currencyTypeName, chaosEquivalent } = line
                linesByType[currencyTypeName] = { ...line, chaosValue: chaosEquivalent }
                if (currencyTypeName === "Divine Orb") {
                    DIVINE_VALUE = chaosEquivalent
                }
            })

            const allCurrencies = currencyDetails
                .filter(({ name }) => name in linesByType)
                .map((item) => {
                    const line = linesByType[item.name]
                    return {
                        ...item,
                        // fill with zero first, actual value is added below
                        divineValue: 0,
                        ...line,
                        endpoint,
                    }
                })

            CURRENCIES = CURRENCIES.concat(allCurrencies)
        })
    )

    return CURRENCIES.map((item) => ({
        ...item,
        divineValue: truncateFloat(item.chaosValue / DIVINE_VALUE, 5),
    }))
}
