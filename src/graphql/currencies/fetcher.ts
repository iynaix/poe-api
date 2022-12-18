import { URL, URLSearchParams } from "url"

import { truncateFloat, truncateTimestamp } from "../../utils"
import { CURRENCY_ENDPOINTS, LEAGUES, NINJA_API_URL } from "../../utils/constants"
import { NinjaCurrencies } from "./ninja_types"
import { Currency, LineWithChaos } from "./types"

const CACHE_THRESHOLD = process.env.NODE_ENV === "production" ? 10 * 60 : 60 * 60

export let CURRENCY_LAST_FETCHED = undefined
export let DIVINE_VALUE = 0
export let CURRENCIES: Currency[] = []

export type LeagueType = keyof typeof LEAGUES

const getNinjaUrl = (endpoint: string, league: LeagueType = "tmpstandard") => {
    const url = new URL(NINJA_API_URL)
    const now = new Date()

    url.pathname = `/api/data/${
        CURRENCY_ENDPOINTS.includes(endpoint) ? "currencyoverview" : "itemoverview"
    }`
    url.search = new URLSearchParams({
        league: LEAGUES[league] || LEAGUES.tmpstandard,
        type: endpoint,
        date: `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`,
    }).toString()
    return url.toString()
}

const fetchNinja = async <T>(endpoint: string, league: LeagueType = "tmpstandard") =>
    fetch(getNinjaUrl(endpoint, league)).then((resp) => resp.json()) as T

// fetches and returns the currencies
export const fetchCurrencies = async (league: LeagueType = "tmpstandard") => {
    const fetchTime = truncateTimestamp(undefined, CACHE_THRESHOLD)

    // TODO: handle cache invalidation here

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
                        ...line,
                        divineValue: truncateFloat(line.chaosValue / DIVINE_VALUE, 5),
                        endpoint,
                    }
                })

            CURRENCIES = CURRENCIES.concat(allCurrencies)
        })
    )

    return CURRENCIES.map((item) => ({
        ...item,
    }))
}
