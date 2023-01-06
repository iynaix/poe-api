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
            divineValue: prices["Divine Orb"]?.chaosValue || 0,
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

export type Asset = number

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
            add: (id: string, count: number) =>
                set((state) => ({ assets: { ...state.assets, [id]: count } })),
            remove: (id: string) =>
                set((state) => {
                    // eslint-disable-next-line @typescript-eslint/no-unused-vars
                    const { [id]: _, ...rest } = state.assets
                    return { assets: rest }
                }),
            totalChaos: () => {
                const { getById } = usePriceStore.getState()

                let total = 0
                for (const [assetId, count] of Object.entries(get().assets)) {
                    const price = getById(assetId)
                    total += price.chaosValue * count
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

export type Target = { count: number }

export type TargetStore = MapStore<Target> & {
    targets: Record<string, Target>
    totalChaos: () => number
    totalDivines: () => number
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
        }),
        {
            name: "targets",
        }
    )
)

export const SAVED_PROGRESS_VERSION = 1

export type SavedProgressState = {
    assets: Record<string, Asset>
    targets: Record<string, Target>
    version: number
}
