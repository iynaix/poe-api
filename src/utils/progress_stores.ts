import create from "zustand"
import type { Price } from "../server/trpc/router/prices"

type PricesState = {
    prices: Record<string, Price>
    divineValue: number
    set: (prices: Record<string, Price>) => void
    add: (id: string, price: Price) => void
    remove: (id: string) => void
    getById: (id: string) => Price
}

export const usePriceStore = create<PricesState>((set, get) => ({
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

type AssetState = {
    assets: Record<string, number>
    set: (assets: Record<string, number>) => void
    add: (id: string, count: number) => void
    remove: (id: string) => void
    totalChaos: () => number
    totalDivines: () => number
}

export const useAssetStore = create<AssetState>((set, get) => ({
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
        return total
    },
    totalDivines: () => {
        const { divineValue } = usePriceStore.getState()
        return get().totalChaos() / divineValue
    },
}))

export type TargetState = {
    targets: Record<string, number>
    set: (targets: Record<string, number>) => void
    add: (id: string, count: number) => void
    remove: (id: string) => void
    totalChaos: () => number
    totalDivines: () => number
}

export const useTargetStore = create<TargetState>((set, get) => ({
    targets: {},
    set: (targets) => set(() => ({ targets })),
    add: (id: string, count: number) =>
        set((state) => ({ targets: { ...state.targets, [id]: count } })),
    remove: (id: string) =>
        set((state) => {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { [id]: _, ...rest } = state.targets
            return { targets: rest }
        }),
    totalChaos: () => {
        const { getById } = usePriceStore.getState()

        let total = 0
        for (const [targetId, count] of Object.entries(get().targets)) {
            const price = getById(targetId)
            total += price.chaosValue * count
        }
        return total
    },
    totalDivines: () => {
        const { divineValue } = usePriceStore.getState()
        return get().totalChaos() / divineValue
    },
}))
