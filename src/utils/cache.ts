import fs from "fs"
import { CACHE_THRESHOLD } from "./constants"
import type { LeagueName } from "."

// unix timestamp in seconds
const timestamp = (dt: Date = new Date()) => Math.floor(dt.getTime() / 1000)

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
