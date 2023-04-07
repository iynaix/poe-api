import { Aggregator } from "mingo"
import pThrottle from "p-throttle"
import { load as cheerioLoad, type CheerioAPI } from "cheerio"
import { router, publicProcedure } from "../trpc"
// import CachedGemData from "./gemData.json"
import { fetchItemEndpoint } from "../../../graphql/items/fetcher"
import { fetchCurrencyEndpoint } from "../../../graphql/currencies/fetcher"

export const textLink = (sel: ReturnType<CheerioAPI>) =>
    [sel.text().trim(), sel.attr("href")] as const

const BASE_URL = "https://poedb.tw"

const _fetchGemsPage = async () => {
    const content = await fetch(`${BASE_URL}/us/Gem`).then((res) => res.text())

    const $ = cheerioLoad(content)

    const gems: Record<string, string> = {}
    $("a.itemclass_gem").each((_, el) => {
        const [name, link] = textLink($(el))

        if (!name.startsWith("Awakened ") && !name.startsWith("Vaal ") && link) {
            gems[name] = `${BASE_URL}${link}`
        }
    })

    return gems
}

const _fetchGemData = async (gemUrl: string) => {
    const content = await fetch(gemUrl).then((res) => res.text())

    const $ = cheerioLoad(content)
    const qualities: Record<string, number> = {}

    $("td:contains('Superior')")
        .parents("tbody")
        .find("tr")
        .each((_, el) => {
            const row = $(el)
            const qualityName = row.find("td:first-child").text().replace(" ", "")
            const qualityWeight = Number(row.find("td:last-child").text())

            qualities[qualityName] = qualityWeight
        })

    return qualities
}

export const gemRouter = router({
    fetchList: publicProcedure.query(async () => {
        const allGems = await _fetchGemsPage()
        type Gem = {
            name: string
            qualities: Record<string, number>
        }
        const gemData: Record<string, Gem> = {}

        const throttledFetch = pThrottle({ limit: 5, interval: 800 })(_fetchGemData)

        await Promise.all(
            Object.entries(allGems).map(async ([name, link]) => {
                gemData[name] = {
                    name,
                    qualities: await throttledFetch(link),
                }
            })
        )

        return gemData
    }),

    profit: publicProcedure.query(async () => {
        // get price of lenses
        const currencies = await fetchCurrencyEndpoint("Currency", "standard")
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const primaryLens = currencies.find(
            (currency) => currency.name === "Prime Regrading Lens"
        )!.chaosValue
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const secondaryLens = currencies.find(
            (currency) => currency.name === "Secondary Regrading Lens"
        )!.chaosValue

        // get gem prices

        const gemPrices = await fetchItemEndpoint("SkillGem", "standard")

        const minPrice = Math.min(primaryLens, secondaryLens)
        const candidates = gemPrices.filter((gem) => {
            if (gem.name.startsWith("Vaal ")) {
                return false
            }

            if ((gem.gemQuality ?? 0) > 20) {
                return false
            }

            if ((gem.gemLevel ?? 0) > 20) {
                return false
            }

            if (gem.corrupted ?? false) {
                return false
            }

            if (gem.name.startsWith("Awakened ")) {
                return false
            }

            return true
        })

        return candidates
    }),
})
