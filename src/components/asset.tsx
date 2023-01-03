import Image from "next/image"
import type { Price } from "../server/trpc/router/prices"

const POE_ICON_SIZE = 47

export type Asset = {
    price: Price
    count: number
}

type AssetProps = {
    asset: Asset
    updateAsset: (id: string, asset: Asset) => void
    removeAsset: (id: string) => void
}

const Asset = ({ asset, updateAsset, removeAsset }: AssetProps) => {
    const showDelete = !(asset.price.name === "Divine Orb" || asset.price.name === "Chaos Orb")

    return (
        <label htmlFor={asset.price.name} className="block">
            {asset.price.icon && (
                <Image
                    src={asset.price.icon}
                    alt={asset.price.name}
                    className="inline-block h-6 w-6"
                    width={POE_ICON_SIZE}
                    height={POE_ICON_SIZE}
                />
            )}
            <span className="text-gray-50">{asset.price.name}</span>
            <input
                className="bg-gray-800 text-gray-50"
                type="number"
                name={asset.price.name}
                value={asset.count}
                min={0}
                onChange={(ev) =>
                    updateAsset(asset.price.id, {
                        ...asset,
                        count: Number(ev.target.value),
                    })
                }
            />

            {showDelete && (
                <span
                    className="ml-2"
                    onClick={() => {
                        removeAsset(asset.price.id)
                    }}
                >
                    x
                </span>
            )}
        </label>
    )
}

export default Asset
