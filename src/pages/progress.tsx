import { trpc } from "../utils/trpc"
import Image from "next/image"
import type { Price } from "../server/trpc/router/prices"
import { useState } from "react"

const POE_ICON_SIZE = 47
const CHAOS_ICON =
    "https://web.poecdn.com/image/Art/2DItems/Currency/CurrencyRerollRare.png?scale=1&w=1&h=1"

type Asset = {
    price: Price
    count: number
}

type AssetProps = {
    asset: Asset
    label?: string
    updateAsset: (id: string, count: number) => void
}

const Asset = ({ label, asset, updateAsset }: AssetProps) => {
    const name = label ?? asset.price.name

    return (
        <label htmlFor={asset.price.name} className="block">
            {asset.price.icon && (
                <Image
                    src={asset.price.icon}
                    alt={name}
                    className="inline-block h-6 w-6"
                    width={POE_ICON_SIZE}
                    height={POE_ICON_SIZE}
                />
            )}
            <span className="text-gray-50">{name}</span>
            <input
                className="bg-gray-800 text-gray-50"
                type="number"
                name={asset.price.name}
                value={asset.count}
                min={0}
                onChange={(ev) => updateAsset(asset.price.id, Number(ev.target.value))}
            />
        </label>
    )
}

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
                    return <Asset key={key} asset={asset} updateAsset={updateAsset} />
                })}

                <span className="">Total Divines: {totalDivines}</span>
                <span className="">Total Chaos: {totalChaos}</span>
            </div>

            {/* <span className="text-3xl font-bold underline">Progress</span> */}

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
