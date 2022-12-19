import { timestamp, LeagueName, fetchNinja } from "../../utils"
import { ITEM_ENDPOINTS, LEAGUES } from "../../utils/constants"
import { NinjaItems } from "./ninja_types"
import { Item } from "./types"

const CACHE_THRESHOLD = process.env.NODE_ENV === "production" ? 10 * 60 : 60 * 60
export let ITEMS_LAST_FETCHED: number | undefined = undefined
export let DIVINE_VALUE = 0
export let ITEMS: Item[] = []

export type LeagueType = keyof typeof LEAGUES

// fetches and inserts the items if needed
export const fetchItems = async (league: LeagueName) => {
    const fetchTime = timestamp()

    // use cache if below threshold
    if (ITEMS_LAST_FETCHED && fetchTime - ITEMS_LAST_FETCHED < CACHE_THRESHOLD) {
        return ITEMS
    }

    console.log(`Fetching items from poe.ninja... (${fetchTime})`)

    ITEMS_LAST_FETCHED = fetchTime
    ITEMS = []

    await Promise.all(
        ITEM_ENDPOINTS.map(async (endpoint) => {
            const items = await fetchNinja<NinjaItems>(endpoint, league)
            ITEMS = ITEMS.concat(
                items["lines"].map((item) => ({
                    ...item,
                    relic: item.icon ? item.icon.includes("relic=1") : false,
                    endpoint,
                }))
            )
        })
    )

    return ITEMS
}
