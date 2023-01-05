import { useRouter } from "next/router"
import { trpc } from "../../utils/trpc"
import TargetList from "../../components/target_list"
import AssetList from "../../components/asset_list"
import { CHAOS_ICON } from "../../components/poe_icon"
import { usePriceStore, useAssetStore, useTargetStore } from "../../utils/progress_stores"
import type { ProgressState } from "../../utils/progress_stores"
import uniq from "lodash/uniq"
import LZString from "lz-string"
import PaneHeader from "../../components/progress/pane_header"

export default function ProgressLoader() {
    const { prices, set: setPrices, divineValue } = usePriceStore()
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
                    addAsset("Divine Orb", 0)
                }
                if (!("Chaos Orb" in assets)) {
                    addAsset("Chaos Orb", 0)
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
                return JSON.parse(jsonString) as ProgressState
            }
        } else if (stateFromUrl.length === 1) {
            const jsonString = LZString.decompressFromEncodedURIComponent(stateFromUrl[0]!)
            if (jsonString) {
                return JSON.parse(jsonString) as ProgressState
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
            {/* <div>
                <label htmlFor="inc">
                    <span>Inc Per Day</span>
                    <input
                        className="bg-gray-800 text-gray-50"
                        name="Search"
                        type="text"
                        value={""}
                        min={0}
                        onChange={(ev) => {
                            setQuery(ev.target.value)
                        }}
                    />
                </label>

                <label htmlFor="earn">
                    <span>Earn Rate</span>
                    <input
                        className="bg-gray-800 text-gray-50"
                        name="Search"
                        type="text"
                        value={""}
                        min={0}
                        onChange={(ev) => {
                            setQuery(ev.target.value)
                        }}
                    />
                </label>
            </div> */}
            <div className="grid grid-cols-2 gap-20">
                <div className="p-4">
                    <PaneHeader
                        right={
                            <button
                                type="button"
                                className="inline-flex items-center rounded-md border px-4 py-2 text-sm font-medium shadow-sm border-transparent text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                                Add
                            </button>
                        }
                    >
                        I Want
                    </PaneHeader>

                    <AssetList />
                </div>

                <div>
                    <h1 className="text-6xl font-bold">I Want</h1>

                    <TargetList />
                </div>
            </div>
        </>
    )
}
