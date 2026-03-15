import pThrottle from "p-throttle"
import type { LeagueName } from "../../utils"
import { fetchNinja } from "../../utils"
import { cachedLeagueData } from "../../utils/cache"
import type { StashEndpointEnum } from "../../utils/constants"
import { STASH_ENDPOINTS } from "../../utils/constants"
import type { NinjaStash } from "./ninja_types"
import type { Item } from "./types"

export const fetchStashEndpoint = async (endpoint: StashEndpointEnum, league: LeagueName) => {
    const items = await fetchNinja<NinjaStash>(endpoint, league)

    return items["lines"].map((item) => {
        let name = item.name

        const isRelic = item.detailsId.endsWith("-relic")

        if (isRelic) {
            name = `${item.name} (Relic)`
        }

        if (endpoint === "SkillGem") {
            const corrupted = Boolean(item.corrupted) ? " (Corrupted)" : ""
            name = `${item.name} (${item.gemLevel}/${item.gemQuality || 0}${corrupted})`
        }

        return {
            ...item,
            name,
            relic: isRelic,
            endpoint,
        }
    })
}

// fetches and inserts the items if needed
export const fetchStash = async (league: LeagueName) =>
    cachedLeagueData<Item[]>("/tmp/__cache__items.json", league, async () => {
        let ITEMS: Item[] = []
        const throttle = pThrottle({ limit: 5, interval: 1000 })
        const throttledFetch = throttle(fetchStashEndpoint)

        await Promise.all(
            STASH_ENDPOINTS.map(async (endpoint) => {
                const fetchedItems = await throttledFetch(endpoint, league)

                ITEMS = ITEMS.concat(fetchedItems)
            })
        )

        return ITEMS
    })
