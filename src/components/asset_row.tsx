import { priceStore, assetStore, type Asset } from "../utils/progress_stores"
import { TrashIcon } from "@heroicons/react/24/outline"
import { TogglePrice, PoeIconText } from "./poe_icon"
import Input from "./input"

type AssetRowProps = {
    assetId: string
    asset: Asset
}

const AssetRow = ({ assetId, asset }: AssetRowProps) => {
    const showDelete = !(assetId === "divine" || assetId === "chaos")

    const price = priceStore.get.priceById(assetId)

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
                    text={price.name}
                    secondary={
                        <TogglePrice
                            className="mt-1 opacity-60"
                            divineValue={price.divineValue}
                            chaosValue={price.chaosValue}
                            size={15}
                        />
                    }
                />
            </td>
            <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                <div>
                    <label htmlFor={price.name} className="sr-only">
                        {price.name}
                    </label>
                    <Input
                        type="number"
                        name={price.name}
                        value={asset.count}
                        onChange={(ev) =>
                            assetStore.set.add(price.id, {
                                count: Number(ev.target.value),
                            })
                        }
                    />
                </div>
            </td>
            <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                {showDelete && (
                    <TrashIcon
                        className="h-5 w-5 cursor-pointer text-maroon"
                        aria-hidden="true"
                        onClick={() => {
                            assetStore.set.remove(assetId)
                        }}
                    />
                )}
            </td>
        </tr>
    )
}

export default AssetRow
