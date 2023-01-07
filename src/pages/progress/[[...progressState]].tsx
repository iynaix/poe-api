import { useRouter } from "next/router"
import { trpc } from "../../utils/trpc"
import { CHAOS_ICON } from "../../components/poe_icon"
import { usePriceStore, useAssetStore, useTargetStore } from "../../utils/progress_stores"
import type { SavedProgressState } from "../../utils/progress_stores"
import uniq from "lodash/uniq"
import LZString from "lz-string"
import Tabs from "../../components/tabs"
import AssetPanel from "../../components/asset_panel"
import TargetPanel from "../../components/target_panel"

export default function ProgressLoader() {
    const { prices, set: setPrices } = usePriceStore()
    const { assets, add: addAsset } = useAssetStore()
    const { targets } = useTargetStore()

    // extra ids might exist in assets or targets as rehydrated from localstorage
    const idsToFetch = uniq([
        "Divine Orb",
        ...Object.keys(prices),
        ...Object.keys(assets),
        ...Object.keys(targets),
    ])

    const { data, isLoading } = trpc.prices.list.useQuery(
        {
            ids: idsToFetch,
        },
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
            onSuccess: (data) => {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                const divineValue = data["Divine Orb"]!.chaosValue

                setPrices({
                    ...data,
                    // create chaos orb data as it isn't provided by poe ninja
                    "Chaos Orb": {
                        id: "Chaos Orb",
                        name: "Chaos Orb",
                        icon: CHAOS_ICON,
                        chaosValue: 1,
                        divineValue: 1 / divineValue,
                    },
                })

                // initialize assets
                if (!("Divine Orb" in assets)) {
                    addAsset("Divine Orb", { count: 0 })
                }
                if (!("Chaos Orb" in assets)) {
                    addAsset("Chaos Orb", { count: 0 })
                }
            },
        }
    )

    if (isLoading || !data) {
        return <div>Loading...</div>
    }

    return <Progress />
}

const useUrlProgressState = () => {
    const router = useRouter()
    const stateFromUrl = router.query.progressState

    if (stateFromUrl) {
        if (typeof stateFromUrl === "string") {
            const jsonString = LZString.decompressFromEncodedURIComponent(stateFromUrl)
            if (jsonString) {
                return JSON.parse(jsonString) as SavedProgressState
            }
        } else if (stateFromUrl.length === 1) {
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            const jsonString = LZString.decompressFromEncodedURIComponent(stateFromUrl[0]!)
            if (jsonString) {
                return JSON.parse(jsonString) as SavedProgressState
            }
        }
    }
}

const Progress = () => {
    // const initialState = useUrlProgressState()
    // const assets = useAssetStore((state) => state.assets)
    // const targets = useTargetStore((state) => state.targets)
    // const isStateChanged =
    //     assets["Divine Orb"] !== 0 || assets["Chaos Orb"] !== 0 || Object.keys(targets).length !== 0
    // if (isStateChanged) {
    //     const pageState = { assets, targets }
    //     const urlEncodedState = LZString.compressToEncodedURIComponent(JSON.stringify(pageState))
    //     window.history.pushState(pageState, "", `/progress/${urlEncodedState}`)
    // } else {
    //     window.history.pushState({}, "", `/progress/`)
    // }

    return (
        <>
            {/* mobile tabs */}
            <div className="md:hidden">
                <Tabs />
                <AssetPanel />
            </div>
            {/* desktop panes */}
            <div className="hidden grid-cols-2 gap-20 md:visible md:grid">
                <AssetPanel />
                <TargetPanel />
            </div>
        </>
    )
}
