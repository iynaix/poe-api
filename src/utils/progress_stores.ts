import create from "zustand"
import { subscribeWithSelector } from "zustand/middleware"
import type { Price } from "../server/trpc/router/prices"
import LZString from "lz-string"

type PricesState = {
    prices: Record<string, Price>
    divineValue: number
    set: (prices: Record<string, Price>) => void
    add: (id: string, price: Price) => void
    remove: (id: string) => void
    getById: (id: string) => Price
}

export const usePriceStore = create<PricesState>()(
    subscribeWithSelector((set, get) => ({
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
)

type AssetState = {
    assets: Record<string, number>
    set: (assets: Record<string, number>) => void
    add: (id: string, count: number) => void
    remove: (id: string) => void
    totalChaos: () => number
    totalDivines: () => number
}

export const useAssetStore = create<AssetState>()(
    subscribeWithSelector((set, get) => ({
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
    }))
)

export type TargetState = {
    targets: Record<string, number>
    set: (targets: Record<string, number>) => void
    add: (id: string, count: number) => void
    remove: (id: string) => void
    totalChaos: () => number
    totalDivines: () => number
}

export const useTargetStore = create<TargetState>()(
    subscribeWithSelector((set, get) => ({
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
)

type SavedProgressState = {
    assets: Record<string, number>
    targets: Record<string, number>
}

export type ProgressState = {
    toJSON: () => SavedProgressState
    toURLParam: () => string
    fromURLParam: (param: string) => SavedProgressState
}

export const useProgressStore = create<ProgressState>()((set, get) => ({
    toJSON: () => {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        const assets = useAssetStore((state) => state.assets)
        // eslint-disable-next-line react-hooks/rules-of-hooks
        const targets = useTargetStore((state) => state.targets)

        return { assets, targets }
    },
    // encoding data inside of a url query string
    // https://garrett-bodley.medium.com/encoding-data-inside-of-a-url-query-string-f286b7e20465
    toURLParam: () => {
        const data = get().toJSON()

        return LZString.compressToEncodedURIComponent(JSON.stringify(data))
    },
    fromURLParam: (param: string) => {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        return JSON.parse(LZString.decompressFromEncodedURIComponent(param)!) as SavedProgressState
    },
}))
