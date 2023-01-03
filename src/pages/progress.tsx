import { trpc } from "../utils/trpc"
import { useState } from "react"
import type { Asset } from "../components/asset"
import AssetRow from "../components/asset"
import SearchById from "../components/search_by_id"

const CHAOS_ICON =
    "https://web.poecdn.com/image/Art/2DItems/Currency/CurrencyRerollRare.png?scale=1&w=1&h=1"

const useAssets = (initialAssets: Record<string, Asset>) => {
    const [assets, setAssets] = useState<Record<string, Asset>>(initialAssets)

    const updateAssetCount = (id: string, count: number) => {
        setAssets((prevAssets) => {
            const asset = prevAssets[id]

            if (!asset) {
                throw new Error(`Asset ${id} not found`)
            }

            return {
                ...prevAssets,
                [id]: {
                    ...asset,
                    count,
                },
            }
        })
    }

    const totalChaos = Object.values(assets).reduce((acc, asset) => {
        return acc + asset.count * asset.price.chaosValue
    }, 0)

    return {
        assets,
        updateAsset: updateAssetCount,
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        totalDivines: totalChaos / assets["Divine Orb"]!.price.divineValue,
        totalChaos,
    }
}

type ProgressProps = {
    assets: Record<string, Asset>
}

const Progress = ({ assets: initialAssets }: ProgressProps) => {
    const { assets, updateAsset, totalDivines, totalChaos } = useAssets(initialAssets)

    return (
        <>
            <h1 className="text-3xl font-bold underline">Assets</h1>

            <div className="grid grid-cols-1 gap-6">
                {Object.entries(assets).map(([key, asset]) => {
                    return <AssetRow key={key} asset={asset} updateAsset={updateAsset} />
                })}

                <span className="">Total Divines: {totalDivines}</span>
                <span className="">Total Chaos: {totalChaos}</span>
            </div>

            <SearchById />

            {/* <pre>{JSON.stringify(assets, null, 2)}</pre> */}
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
