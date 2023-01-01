import fs from "fs"
import type { CurrencyEndpointEnum, ItemEndpointEnum } from "./constants"
import { NINJA_API_URL, CURRENCY_ENDPOINTS, LEAGUES, CACHE_THRESHOLD } from "./constants"

export type LeagueName = keyof typeof LEAGUES

type AllEndpoints = CurrencyEndpointEnum | ItemEndpointEnum

const ninjaAPIUrl = (endpoint: AllEndpoints, league: LeagueName = "tmpstandard") => {
    const url = new URL(NINJA_API_URL)
    const now = new Date()

    url.pathname = `/api/data/${
        // @ts-expect-error ignore includes error
        CURRENCY_ENDPOINTS.includes(endpoint) ? "currencyoverview" : "itemoverview"
    }`
    url.search = new URLSearchParams({
        league: LEAGUES[league] || LEAGUES.tmpstandard,
        type: endpoint,
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

export const cachedLeagueData = async <TData>(
    cacheFilename: string,
    league: LeagueName,
    dataFn: () => Promise<TData>
) => {
    const fetchTime = timestamp()

    // use cache if it is available
    if (fs.existsSync(cacheFilename)) {
        const cache = JSON.parse(fs.readFileSync(cacheFilename).toString()) as Record<
            LeagueName,
            { fetchTime: number; data: TData }
        >
        if (league in cache) {
            const { fetchTime: cacheFetchTime, data: cachedData } = cache[league]

            // use cache if below threshold
            if (cacheFetchTime && fetchTime - cacheFetchTime < CACHE_THRESHOLD) {
                return cachedData
            }
        }
    }

    // cache not available or outdated, fetch data
    const newData = await dataFn()

    // update cache
    fs.writeFileSync(
        cacheFilename,
        JSON.stringify({
            [league]: {
                fetchTime,
                data: newData,
            },
        })
    )

    return newData
}
