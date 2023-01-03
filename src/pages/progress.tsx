import useMap from "react-use/esm/useMap"

import { trpc } from "../utils/trpc"
import type { Asset } from "../components/asset"
import AssetRow from "../components/asset"
import SearchById from "../components/search_by_id"

const CHAOS_ICON =
    "https://web.poecdn.com/image/Art/2DItems/Currency/CurrencyRerollRare.png?scale=1&w=1&h=1"

const useAssets = (initialAssets: Record<string, Asset>) => {
    const [assets, operations] = useMap(initialAssets)

    const totalChaos = Object.values(assets).reduce((acc, asset) => {
        return acc + asset.count * asset.price.chaosValue
    }, 0)

    return {
        assets,
        ...operations,
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        totalDivines: totalChaos / assets["Divine Orb"]!.price.divineValue,
        totalChaos,
    }
}

type ProgressProps = {
    assets: Record<string, Asset>
}

const Progress = ({ assets: initialAssets }: ProgressProps) => {
    const {
        assets,
        set: setAsset,
        remove: removeAsset,
        totalDivines,
        totalChaos,
    } = useAssets(initialAssets)

    return (
        <>
            <h1 className="text-3xl font-bold underline">Assets</h1>

            <div className="grid grid-cols-1 gap-6">
                {Object.entries(assets).map(([key, asset]) => {
                    return (
                        <AssetRow
                            key={key}
                            asset={asset}
                            updateAsset={setAsset}
                            removeAsset={removeAsset}
                        />
                    )
                })}

                <span className="">Total Divines: {totalDivines}</span>
                <span className="">Total Chaos: {totalChaos}</span>
            </div>

            <SearchById
                onClick={(price) => {
                    setAsset(price.id, { price, count: 1 })
                }}
            />
        </>
    )
}

export default function ProgressWrapper() {
    const { data: priceData, isLoading } = trpc.prices.list.useQuery({
        ids: ["Divine Orb"],
    })

    if (isLoading || !priceData) {
        return <div>Loading...</div>
    }

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const divinePrice = priceData["Divine Orb"]!

    return (
        <Progress
            assets={{
                "Divine Orb": {
                    price: divinePrice,
                    count: 0,
                },
                //  create a chaos orb data as it isn't provided by poe ninja
                "Chaos Orb": {
                    price: {
                        id: "Chaos Orb",
                        name: "Chaos Orb",
                        icon: CHAOS_ICON,
                        chaosValue: 1,
                        divineValue: 1 / divinePrice.chaosValue,
                    },
                    count: 0,
                },
            }}
        />
    )
}
