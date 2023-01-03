import { useMap } from "react-use"

import AssetRow from "./asset_row"
import SearchById from "./search_by_id"
import type { Asset } from "./asset_row"
import { truncateFloat } from "../utils"
import { ChaosIcon, DivineIcon } from "./poe_icon"

export const useAssets = (initialAssets: Record<string, Asset>, divineValue: number) => {
    const [assets, operations] = useMap(initialAssets)

    const totalChaos = Object.values(assets).reduce((acc, asset) => {
        return acc + asset.count * asset.price.chaosValue
    }, 0)

    return {
        assets,
        ...operations,
        totalDivines: totalChaos / divineValue,
        totalChaos,
    }
}

type AssetListProps = ReturnType<typeof useAssets>

const AssetList = ({
    assets,
    set: setAsset,
    remove: removeAsset,
    totalDivines,
    totalChaos,
}: AssetListProps) => {
    return (
        <>
            <div className="flex">
                <div className="space- flex flex-1 items-center justify-center">
                    <span className="mr-2 text-[42px]">{truncateFloat(totalDivines, 3)}</span>
                    <DivineIcon className="h-[42px] w-[42px]" />
                </div>
                <div className="space- flex flex-1 items-center justify-center">
                    <span className="mr-2 text-[42px]">{truncateFloat(totalChaos, 3)}</span>
                    <ChaosIcon className="h-[42px] w-[42px]" />
                </div>
            </div>

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
            </div>

            <SearchById
                label="Add Asset"
                onClick={(price) => {
                    setAsset(price.id, { price, count: 1 })
                }}
            />
        </>
    )
}

export default AssetList
