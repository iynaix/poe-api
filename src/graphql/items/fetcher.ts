import pThrottle from "p-throttle"
import type { LeagueName } from "../../utils"
import { fetchNinja } from "../../utils"
import { cachedLeagueData } from "../../utils/cache"
import type { ItemEndpointEnum } from "../../utils/constants"
import { ITEM_ENDPOINTS } from "../../utils/constants"
import type { NinjaItems } from "./ninja_types"
import type { Item } from "./types"

export const fetchItemEndpoint = async (endpoint: ItemEndpointEnum, league: LeagueName) => {
    const items = await fetchNinja<NinjaItems>(endpoint, league)

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
export const fetchItems = async (league: LeagueName) =>
    cachedLeagueData<Item[]>("/tmp/__cache__items.json", league, async () => {
        let ITEMS: Item[] = []
        const throttle = pThrottle({ limit: 5, interval: 1000 })
        const throttledFetch = throttle(fetchItemEndpoint)

        await Promise.all(
            ITEM_ENDPOINTS.map(async (endpoint) => {
                const fetchedItems = await throttledFetch(endpoint, league)

                ITEMS = ITEMS.concat(fetchedItems)
            })
        )

        return ITEMS
    })
