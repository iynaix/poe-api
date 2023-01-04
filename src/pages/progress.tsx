import { trpc } from "../utils/trpc"
import TargetList from "../components/target_list"
import AssetList from "../components/asset_list"
import { CHAOS_ICON } from "../components/poe_icon"
import { usePriceStore, useAssetStore } from "../utils/progress_stores"

export default function ProgressLoader() {
    const { prices, set: setPrices, divineValue } = usePriceStore()
    const { assets, add: addAsset } = useAssetStore()

    const { data, isLoading } = trpc.prices.list.useQuery(
        {
            ids: ["Divine Orb", ...Object.keys(prices)],
        },
        {
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

const Progress = () => {
    return (
        <div className="grid grid-cols-2">
            <div>
                <h1 className="text-6xl font-bold">I Have</h1>

                <AssetList />
            </div>

            <div>
                <h1 className="text-6xl font-bold">I Want</h1>

                <TargetList />
            </div>
        </div>
    )
}
