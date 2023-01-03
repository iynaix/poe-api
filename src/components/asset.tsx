import Image from "next/image"
import type { Price } from "../server/trpc/router/prices"

const POE_ICON_SIZE = 47

export type Asset = {
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

export default Asset
