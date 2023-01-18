import LZString from "lz-string"
import { CHAOS_ICON } from "../components/poe_icon"
import { create } from "zustand"
import type { Price } from "../server/trpc/router/prices"
import { persist } from "zustand/middleware"
import type { LeagueName } from "."
import { trpc } from "./trpc"
import uniq from "lodash/uniq"

type PricesStore = {
    prices: Record<string, Price>
    divineValue: number
    league: LeagueName
    actions: {
        setLeague: (league: LeagueName) => void
        priceById: (id: string) => Price
        inDivines: (chaos: number) => number
        inflationInChaosPerHour: (inflation: Inflation) => number
        set: (objs: Record<string, Price>) => void
        add: (id: string, objs: Price) => void
        remove: (id: string) => void
    }
}

const usePriceStore = create<PricesStore>()((set, get) => {
    return {
        prices: {},
        divineValue: 0,
        league: "tmpstandard",
        actions: {
            setLeague: (league) => set(() => ({ league })),
            priceById: (id) => {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                return get().prices[id]!
            },
            inDivines: (chaos) => {
                return chaos / get().divineValue
            },
            inflationInChaosPerHour: ({ rate, period, currencyType }) => {
                const chaosRate = currencyType === "chaos" ? rate : rate * get().divineValue
                return period === "day" ? chaosRate / 24 : chaosRate
            },
            set: (prices) =>
                set(() => ({
                    prices,
                    divineValue: prices["divine"]?.chaosValue || 0,
                })),
            add: (id, price) => set((state) => ({ prices: { ...state.prices, [id]: price } })),
            remove: (id) =>
                set((state) => {
                    // eslint-disable-next-line @typescript-eslint/no-unused-vars
                    const { [id]: _, ...rest } = state.prices
                    return { prices: rest }
                }),
        },
    }
})

export const usePrices = () => usePriceStore((state) => state.prices)
export const useLeague = () => {
    const league = usePriceStore((state) => state.league)
    const setLeague = usePriceStore((state) => state.actions.setLeague)
    return [league, setLeague] as const
}
export const usePricesActions = () => usePriceStore((state) => state.actions)

export type Asset = {
    count: number
}

type AssetStore = {
    assets: Record<string, Asset>
    actions: {
        add: (id: string, asset: Asset) => void
        remove: (id: string) => void
        total: () => number
    }
}

const useAssetStore = create<AssetStore>()((set, get) => {
    return {
        assets: {},
        actions: {
            // set: (assets) => set(() => ({ assets })),
            add: (id: string, asset: Asset) =>
                set((state) => ({ assets: { ...state.assets, [id]: asset } })),
            remove: (id: string) =>
                set((state) => {
                    // eslint-disable-next-line @typescript-eslint/no-unused-vars
                    const { [id]: _, ...rest } = state.assets
                    return { assets: rest }
                }),
            total: () => {
                const { priceById } = usePriceStore.getState().actions

                let total = 0
                for (const [assetId, asset] of Object.entries(get().assets)) {
                    const price = priceById(assetId)
                    total += price.chaosValue * asset.count
                }
                return total || 0
            },
        },
    }
})

export const useAssets = () => useAssetStore((state) => state.assets)
export const useAssetsActions = () => useAssetStore((state) => state.actions)

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
    actions: {
        total: () => number
        totalInflationRate: () => number
        add: (id: string, target: Target) => void
        remove: (id: string) => void
    }
}

const useTargetStore = create<TargetStore>()((set, get) => {
    return {
        targets: {},
        actions: {
            // set: (targets) => set(() => ({ targets })),
            add: (id: string, target: Target) =>
                set((state) => ({ targets: { ...state.targets, [id]: target } })),
            remove: (id: string) =>
                set((state) => {
                    // eslint-disable-next-line @typescript-eslint/no-unused-vars
                    const { [id]: _, ...rest } = state.targets
                    return { targets: rest }
                }),
            total: () => {
                const { priceById } = usePriceStore.getState().actions

                let total = 0
                for (const [targetId, target] of Object.entries(get().targets)) {
                    const price = priceById(targetId)
                    total += price.chaosValue * target.count
                }
                return total
            },
            totalInflationRate: () => {
                const { inflationInChaosPerHour } = usePriceStore.getState().actions

                let total = 0
                Object.values(get().targets).forEach((target) => {
                    total += inflationInChaosPerHour(target.inflation)
                })

                return total
            },
        },
    }
})

export const useTargets = () => useTargetStore((state) => state.targets)
export const useTargetsActions = () => useTargetStore((state) => state.actions)

type EarnRateStore = {
    earnRate: Inflation
    actions: {
        set: (earnRate: Inflation) => void
        earnRateInChaosPerHour: () => number
        estimatedTimeToTarget: (target: number, inflation: number) => number
        estimatedTimeToAllTargets: () => number
    }
}

const useEarnRateStore = create<EarnRateStore>()((set, get) => {
    return {
        earnRate: {
            currencyType: "divine",
            period: "day",
            rate: 0,
        },
        actions: {
            set: (earnRate) => set(() => ({ earnRate })),
            earnRateInChaosPerHour: () => {
                const { inflationInChaosPerHour } = usePriceStore.getState().actions
                return inflationInChaosPerHour(get().earnRate)
            },
            estimatedTimeToTarget: (target: number, inflationRate: number) => {
                const { total } = useAssetStore.getState().actions
                const current = total()

                const earnRate = get().actions.earnRateInChaosPerHour()

                if (inflationRate === 0) {
                    return (target - current) / earnRate
                }

                // uses the ant on a rubber rope model to give an ETA
                return (
                    ((target - current) / inflationRate) * (Math.exp(inflationRate / earnRate) - 1)
                )
            },
            estimatedTimeToAllTargets: () => {
                const { total, totalInflationRate } = useTargetStore.getState().actions

                return get().actions.estimatedTimeToTarget(total(), totalInflationRate())
            },
        },
    }
})

export const useEarnRate = () => {
    const earnRate = useEarnRateStore((state) => state.earnRate)
    const setEarnRate = useEarnRateStore((state) => state.actions.set)
    return [earnRate, setEarnRate] as const
}
export const useEarnRateActions = () => useEarnRateStore((state) => state.actions)

type SavedProgressState = {
    earnRate: Inflation
    league: LeagueName
    assets: Record<string, Asset>
    targets: Record<string, Target>
}

// create store to persist progress to localstorage
export const usePersistProgressStore = create<SavedProgressState>()(
    persist(
        () => {
            const { league } = usePriceStore.getState()
            const { assets } = useAssetStore.getState()
            const { targets } = useTargetStore.getState()
            const { earnRate } = useEarnRateStore.getState()

            return {
                league,
                assets,
                targets,
                earnRate,
            }
        },
        {
            name: "progress",
        }
    )
)

export const useShareUrl = () => {
    const pageState = usePersistProgressStore()
    const encodedState = LZString.compressToEncodedURIComponent(JSON.stringify(pageState))
    return `${window.location.origin}/progress/${encodedState}`
}

export const usePricesQuery = () => {
    const {
        league,
        prices,
        actions: { set: setPrices },
    } = usePriceStore.getState()
    const {
        assets,
        actions: { add: addAsset },
    } = useAssetStore.getState()
    const { targets } = useTargetStore.getState()

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

                setPrices({
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
                    addAsset("divine", { count: 0 })
                }
                if (!("chaos" in assets)) {
                    addAsset("chaos", { count: 0 })
                }
            },
        }
    )
}
