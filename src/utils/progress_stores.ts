import { CHAOS_ICON } from "../components/poe_icon"
import type { Price } from "../server/trpc/router/prices"
import type { LeagueName } from "."
import { trpc } from "./trpc"
import uniq from "lodash/uniq"

import { createStore } from "@udecode/zustood"

const skipHydration = () => {
    if (typeof window === "undefined") {
        return true
    }
    return Boolean(window.location.href.split("progress/")[1])
}

type PricesStore = {
    prices: Record<string, Price>
    divineValue: number
    league: LeagueName
}

export const priceStore = createStore("prices")<PricesStore>(
    {
        prices: {},
        divineValue: 0,
        league: "tmpstandard",
    },
    {
        persist: {
            name: "prices",
            enabled: true,
            skipHydration: skipHydration(),
        },
    }
)
    .extendSelectors((_, get) => ({
        priceById(id) {
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            return get.prices()[id]!
        },
        inDivines(chaos) {
            return chaos / get.divineValue() || 0
        },
        inflationInChaosPerHour({ rate, period, currencyType }) {
            const chaosRate = currencyType === "chaos" ? rate : rate * get.divineValue()
            return period === "day" ? chaosRate / 24 : chaosRate
        },
    }))
    .extendActions((set, get) => ({
        add(id: string, price: Price) {
            set.prices({ ...get.prices(), [id]: price })
        },
    }))

export type Asset = {
    count: number
}

type AssetStore = {
    assets: Record<string, Asset>
}

export const assetStore = createStore("assets")<AssetStore>(
    {
        assets: {},
    },
    {
        persist: {
            name: "assets",
            enabled: true,
            skipHydration: skipHydration(),
        },
    }
)
    .extendSelectors((_, get) => ({
        total() {
            let total = 0
            for (const [assetId, asset] of Object.entries(get.assets())) {
                const price = priceStore.get.priceById(assetId)
                total += price.chaosValue * asset.count
            }
            return total || 0
        },
    }))
    .extendActions((set, get) => ({
        add(id: string, asset: Asset) {
            set.assets({ ...get.assets(), [id]: asset })
        },
        remove(id: string) {
            const { [id]: _, ...rest } = get.assets()
            set.assets(rest)
        },
    }))

export type Inflation = {
    currencyType: "divine" | "chaos"
    period: "day" | "hour"
    rate: number
}

export type Target = {
    count: number
    inflation: Inflation
}

type TargetStore = {
    targets: Record<string, Target>
}

export const targetStore = createStore("targets")<TargetStore>(
    {
        targets: {},
    },
    {
        persist: {
            name: "targets",
            enabled: true,
            skipHydration: skipHydration(),
        },
    }
)
    .extendSelectors((_, get) => ({
        total() {
            let total = 0
            for (const [targetId, target] of Object.entries(get.targets())) {
                const price = priceStore.get.priceById(targetId)
                total += price.chaosValue * target.count
            }
            return total
        },
        totalInflationRate() {
            let total = 0
            Object.values(get.targets()).forEach((target) => {
                total += priceStore.get.inflationInChaosPerHour(target.inflation)
            })

            return total
        },
    }))
    .extendActions((set, get) => ({
        add(id: string, target: Target) {
            set.targets({ ...get.targets(), [id]: target })
        },
        remove(id: string) {
            const { [id]: _, ...rest } = get.targets()
            set.targets(rest)
        },
    }))

type EarnRateStore = {
    earnRate: Inflation
}

export const earnRateStore = createStore("earnRate")<EarnRateStore>(
    {
        earnRate: {
            currencyType: "divine",
            period: "day",
            rate: 0,
        },
    },
    {
        persist: {
            name: "earnRate",
            enabled: true,
            skipHydration: skipHydration(),
        },
    }
)
    .extendSelectors((_, get) => ({
        earnRateInChaosPerHour() {
            return priceStore.get.inflationInChaosPerHour(get.earnRate())
        },
    }))
    .extendSelectors((set, get) => ({
        estimatedTimeToTarget(target: number, inflationRate: number) {
            const current = assetStore.get.total()
            const earnRate = get.earnRateInChaosPerHour()

            if (inflationRate === 0) {
                return (target - current) / earnRate
            }

            // uses the ant on a rubber rope model to give an ETA
            return ((target - current) / inflationRate) * (Math.exp(inflationRate / earnRate) - 1)
        },
    }))
    .extendSelectors((set, get) => ({
        estimatedTimeToAllTargets() {
            const { total, totalInflationRate } = targetStore.get

            return get.estimatedTimeToTarget(total(), totalInflationRate())
        },
    }))

export const usePricesQuery = () => {
    const prices = priceStore.use.prices()
    const league = priceStore.use.league()
    const assets = assetStore.use.assets()
    const targets = targetStore.use.targets()

    // construct ids from assets and targets
    const priceIds = uniq(["divine", ...Object.keys(assets), ...Object.keys(targets)])

    return trpc.prices.list.useQuery(
        { ids: priceIds, league },
        {
            // refetch every 10 minutes
            refetchInterval: 1000 * 60 * 10,
            placeholderData: () => {
                if (Object.keys(prices).length === 0) {
                    return undefined
                } else {
                    return prices
                }
            },
            onSuccess: (data: Record<string, Price>) => {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                const divineValue = data["divine"]!.chaosValue

                priceStore.set.divineValue(divineValue)

                priceStore.set.prices({
                    ...data,
                    // create chaos orb data as it isn't provided by poe ninja
                    chaos: {
                        id: "chaos",
                        name: "Chaos Orb",
                        icon: CHAOS_ICON,
                        chaosValue: 1,
                        divineValue: 1 / divineValue,
                        endpoint: "Currency",
                    },
                })

                // initialize assets
                if (!("divine" in assets)) {
                    assetStore.set.add("divine", { count: 0 })
                }
                if (!("chaos" in assets)) {
                    assetStore.set.add("chaos", { count: 0 })
                }
            },
        }
    )
}
