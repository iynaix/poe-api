import PoeIcon from "./poe_icon"
import type { Price } from "../server/trpc/router/prices"

export type Asset = {
    price: Price
    count: number
}

type AssetProps = {
    asset: Asset
    updateAsset: (id: string, asset: Asset) => void
    removeAsset: (id: string) => void
}

const AssetRow = ({ asset, updateAsset, removeAsset }: AssetProps) => {
    const showDelete = !(asset.price.name === "Divine Orb" || asset.price.name === "Chaos Orb")

    return (
        <label htmlFor={asset.price.name} className="block">
            {asset.price.icon && (
                <PoeIcon
                    icon={asset.price.icon}
                    alt={asset.price.name}
                    className="h-[36px] w-[36px]"
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

export default AssetRow
