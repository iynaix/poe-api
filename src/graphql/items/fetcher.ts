import pThrottle from "p-throttle"
import { LeagueName, fetchNinja, cachedLeagueData } from "../../utils"
import { ItemEndpointEnum, ITEM_ENDPOINTS } from "../../utils/constants"
import { NinjaItems } from "./ninja_types"
import { Item } from "./types"

export const fetchItemEndpoint = async (endpoint: ItemEndpointEnum, league: LeagueName) => {
    const items = await fetchNinja<NinjaItems>(endpoint, league)

    return items["lines"].map((item) => ({
        ...item,
        relic: item.icon ? item.icon.includes("relic=1") : false,
        endpoint,
    }))
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
