import create from "zustand"
import type { Price } from "../server/trpc/router/prices"
import { persist } from "zustand/middleware"

type MapStore<T> = {
    set: (objs: Record<string, T>) => void
    add: (id: string, objs: T) => void
    remove: (id: string) => void
}

type PricesStore = MapStore<Price> & {
    prices: Record<string, Price>
    divineValue: number
    getById: (id: string) => Price
}

export const usePriceStore = create<PricesStore>()((set, get) => ({
    prices: {},
    divineValue: 0,
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
    getById: (id) => {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        return get().prices[id]!
    },
}))

export type Asset = {
    count: number
}

type AssetStore = MapStore<Asset> & {
    assets: Record<string, Asset>
    totalChaos: () => number
    totalDivines: () => number
}

export const useAssetStore = create<AssetStore>()(
    persist(
        (set, get) => ({
            assets: {},
            set: (assets) => set(() => ({ assets })),
            add: (id: string, asset: Asset) =>
                set((state) => ({ assets: { ...state.assets, [id]: asset } })),
            remove: (id: string) =>
                set((state) => {
                    // eslint-disable-next-line @typescript-eslint/no-unused-vars
                    const { [id]: _, ...rest } = state.assets
                    return { assets: rest }
                }),
            totalChaos: () => {
                const { getById } = usePriceStore.getState()

                let total = 0
                for (const [assetId, asset] of Object.entries(get().assets)) {
                    const price = getById(assetId)
                    total += price.chaosValue * asset.count
                }
                return total || 0
            },
            totalDivines: () => {
                const { divineValue } = usePriceStore.getState()
                return get().totalChaos() / divineValue
            },
        }),
        {
            name: "assets",
        }
    )
)

export type Inflation = {
    currencyType: "divine" | "chaos"
    period: "day" | "hour"
    rate: number
}

export type Target = {
    count: number
    inflation: Inflation
}

export type TargetStore = MapStore<Target> & {
    targets: Record<string, Target>
    totalChaos: () => number
    totalDivines: () => number
    totalInflationRate: () => number
}

export const inflationInChaosPerHour = (
    { rate, period, currencyType }: Inflation,
    divineValue: number
) => {
    const chaosRate = currencyType === "chaos" ? rate : rate * divineValue
    return period === "day" ? chaosRate / 24 : chaosRate
}

export const useTargetStore = create<TargetStore>()(
    persist(
        (set, get) => ({
            targets: {},
            set: (targets) => set(() => ({ targets })),
            add: (id: string, target: Target) =>
                set((state) => ({ targets: { ...state.targets, [id]: target } })),
            remove: (id: string) =>
                set((state) => {
                    // eslint-disable-next-line @typescript-eslint/no-unused-vars
                    const { [id]: _, ...rest } = state.targets
                    return { targets: rest }
                }),
            totalChaos: () => {
                const { getById } = usePriceStore.getState()

                let total = 0
                for (const [targetId, target] of Object.entries(get().targets)) {
                    const price = getById(targetId)
                    total += price.chaosValue * target.count
                }
                return total
            },
            totalDivines: () => {
                const { divineValue } = usePriceStore.getState()
                return get().totalChaos() / divineValue
            },
            totalInflationRate: () => {
                const { divineValue } = usePriceStore.getState()

                let total = 0
                Object.values(get().targets).forEach((target) => {
                    total += inflationInChaosPerHour(target.inflation, divineValue)
                })

                return total
            },
        }),
        {
            name: "targets",
        }
    )
)

type EarnRateStore = {
    earnRate: Inflation
    earnRateInChaosPerHour: () => number
    set: (earnRate: Inflation) => void
    estimatedTimeToTarget: (target: number, inflation: number) => number
    estimatedTimeToAllTargets: () => number
}

export const useEarnRateStore = create<EarnRateStore>()(
    persist(
        (set, get) => ({
            earnRate: {
                currencyType: "divine",
                period: "day",
                rate: 0,
            },
            set: (earnRate) => set(() => ({ earnRate })),
            earnRateInChaosPerHour: () => {
                const { divineValue } = usePriceStore.getState()
                return inflationInChaosPerHour(get().earnRate, divineValue)
            },
            estimatedTimeToTarget: (target: number, inflationRate: number) => {
                const { totalChaos } = useAssetStore.getState()
                const current = totalChaos()

                const earnRate = get().earnRateInChaosPerHour()

                if (inflationRate === 0) {
                    return (target - current) / earnRate
                }

                // uses the ant on a rubber rope model to give an ETA
                return (
                    ((target - current) / inflationRate) * (Math.exp(inflationRate / earnRate) - 1)
                )
            },
            estimatedTimeToAllTargets: () => {
                const { totalChaos, totalInflationRate } = useTargetStore.getState()

                return get().estimatedTimeToTarget(totalChaos(), totalInflationRate())
            },
        }),
        {
            name: "earnRate",
        }
    )
)

export const SAVED_PROGRESS_VERSION = 1

export type SavedProgressState = {
    earnRate: Inflation
    assets: Record<string, Asset>
    targets: Record<string, Target>
    version: number
}
