import {
    NINJA_API_URL,
    CURRENCY_ENDPOINTS,
    LEAGUES,
    CurrencyEndpointEnum,
    ItemEndpointEnum,
} from "./constants"

export type LeagueName = keyof typeof LEAGUES

type AllEndpoints = CurrencyEndpointEnum | ItemEndpointEnum

const ninjaAPIUrl = (endpoint: AllEndpoints, league: LeagueName = "tmpstandard") => {
    const url = new URL(NINJA_API_URL)
    const now = new Date()

    url.pathname = `/api/data/${
        // @ts-expect-error
        CURRENCY_ENDPOINTS.includes(endpoint) ? "currencyoverview" : "itemoverview"
    }`
    url.search = new URLSearchParams({
        league: LEAGUES[league] || LEAGUES.tmpstandard,
        type: endpoint,
        date: `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`,
    }).toString()
    return url.toString()
}

export const fetchNinja = async <TResponse>(
    endpoint: AllEndpoints,
    league: LeagueName = "tmpstandard"
) => fetch(ninjaAPIUrl(endpoint, league)).then((resp) => resp.json()) as TResponse

// truncate a float to n decimal places
export const truncateFloat = (n: number, places: number) => {
    const multiplier = Math.pow(10, places || 0)
    return Math.round(n * multiplier) / multiplier
}

// quotient of n / divisor
export const quot = (n: number, divisor: number) => n - (n % divisor)

// unix timestamp in seconds
export const timestamp = (dt: Date = new Date()) => Math.floor(dt.getTime() / 1000)
