import type { LeagueName } from "../../utils"
import { cachedLeagueData } from "../../utils/cache"
import type { SearchResult } from "./types"
import { LEAGUES, NINJA_API_URL } from "../../utils/constants"

export type SearchResultWithEndpoint = SearchResult & { endpoint: string }

// fetches and returns the search results
export const fetchSearch = async (league: LeagueName = "tmpstandard") =>
    cachedLeagueData<SearchResultWithEndpoint[]>("/tmp/__cache__search.json", league, async () => {
        const url = new URL(NINJA_API_URL)

        url.pathname = `/poe1/api/economy/stash/current/search`

        url.search = new URLSearchParams({
            league: LEAGUES[league] || LEAGUES.tmpstandard,
        }).toString()

        return await fetch(url.toString())
            .then((resp) => resp.json())
            .then((data) => {
                const resultsArr: SearchResult[] = []
                for (const endpoint in data.items) {
                    for (const result of data.items[endpoint]) {
                        resultsArr.push({
                            ...result,
                            endpoint,
                        })
                    }
                }
                return resultsArr as SearchResultWithEndpoint[]
            })
    })
