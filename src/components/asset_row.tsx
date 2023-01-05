import PoeIcon from "./poe_icon"
import { usePriceStore, useAssetStore } from "../utils/progress_stores"
import { TrashIcon } from "@heroicons/react/24/outline"
import { PoeIconText } from "./poe_icon"

type AssetRowProps = {
    assetId: string
    count: number
}

const AssetRowOld = ({ assetId, count }: AssetRowProps) => {
    const { getById, remove: removePrice } = usePriceStore()
    const { add: addAsset, remove: removeAsset } = useAssetStore()
    const showDelete = !(assetId === "Divine Orb" || assetId === "Chaos Orb")

    const price = getById(assetId)

    return (
        <label htmlFor={price.name} className="block">
            {price.icon && <PoeIcon icon={price.icon} alt={price.name} size={36} />}
            <span className="text-gray-50">{price.name}</span>
            <input
                className="text-gray-50 bg-gray-800"
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

const AssetRow = ({ assetId, count }: AssetRowProps) => {
    const { getById, remove: removePrice } = usePriceStore()
    const { add: addAsset, remove: removeAsset } = useAssetStore()
    // const showDelete = !(assetId === "Divine Orb" || assetId === "Chaos Orb")
    const showDelete = true

    const price = getById(assetId)

    return (
        <tr>
            <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-6">
                <PoeIconText
                    iconProps={{
                        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                        icon: price.icon!,
                        alt: price.name,
                        size: 36,
                    }}
                    name={price.name}
                />
            </td>
            <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                <div>
                    <label htmlFor={price.name} className="sr-only">
                        {price.name}
                    </label>
                    <input
                        className="text-gray-850 block w-20 rounded-md shadow-sm bg-gray-100 border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        type="number"
                        name={price.name}
                        value={count}
                        min={0}
                        onChange={(ev) => addAsset(price.id, Number(ev.target.value))}
                    />
                </div>
            </td>
            <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                {showDelete && (
                    <TrashIcon
                        className="h-5 w-5 text-red-500"
                        aria-hidden="true"
                        onClick={() => {
                            removeAsset(assetId)
                            removePrice(assetId)
                        }}
                    />
                )}
            </td>
        </tr>
    )
}

export default AssetRow
