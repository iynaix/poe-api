import PoeIcon from "./poe_icon"
import { usePriceStore, useAssetStore } from "../utils/progress_stores"

type AssetRowProps = {
    assetId: string
    count: number
}

const AssetRow = ({ assetId, count }: AssetRowProps) => {
    const { getById, remove: removePrice } = usePriceStore()
    const { add: addAsset, remove: removeAsset } = useAssetStore()
    const showDelete = !(assetId === "Divine Orb" || assetId === "Chaos Orb")

    const price = getById(assetId)

    return (
        <label htmlFor={price.name} className="block">
            {price.icon && <PoeIcon icon={price.icon} alt={price.name} size={36} />}
            <span className="text-gray-50">{price.name}</span>
            <input
                className="bg-gray-800 text-gray-50"
                type="number"
                name={price.name}
                value={count}
                min={0}
                onChange={(ev) => addAsset(price.id, Number(ev.target.value))}
            />

            {showDelete && (
                <span
                    className="ml-2"
                    onClick={() => {
                        removeAsset(assetId)
                        removePrice(assetId)
                    }}
                >
                    x
                </span>
            )}
        </label>
    )
}

export default AssetRow
