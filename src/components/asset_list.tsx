import AssetRow from "./asset_row"
import SearchById from "./search_by_id"
import { truncateFloat } from "../utils"
import { ChaosIcon, DivineIcon } from "./poe_icon"
import { usePriceStore, useAssetStore } from "../utils/progress_stores"

export type AssetMap = Record<string, number>

const AssetList = () => {
    const { add: addPrice } = usePriceStore()
    const { assets, add: addAsset, totalChaos, totalDivines } = useAssetStore()

    return (
        <>
            <div className="flex">
                <div className="space- flex flex-1 items-center justify-center">
                    <span className="mr-2 text-[42px]">{truncateFloat(totalDivines(), 3)}</span>
                    <DivineIcon className="h-[42px] w-[42px]" />
                </div>
                <div className="space- flex flex-1 items-center justify-center">
                    <span className="mr-2 text-[42px]">{truncateFloat(totalChaos(), 3)}</span>
                    <ChaosIcon className="h-[42px] w-[42px]" />
                </div>
            </div>

            <div className="grid grid-cols-1 gap-6">
                {Object.entries(assets).map(([assetId, count]) => {
                    return <AssetRow key={assetId} assetId={assetId} count={count} />
                })}
            </div>

            <SearchById
                label="Add Asset"
                onClick={(price) => {
                    // default count to 1
                    addAsset(price.id, 1)
                    // add to price list
                    addPrice(price.id, price)
                }}
            />
        </>
    )
}

export default AssetList
