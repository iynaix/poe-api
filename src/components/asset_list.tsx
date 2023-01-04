import AssetRow from "./asset_row"
import SearchById from "./search_by_id"
import { ChaosPrice, DivinePrice } from "./poe_icon"
import { usePriceStore, useAssetStore } from "../utils/progress_stores"

export type AssetMap = Record<string, number>

const AssetList = () => {
    const { add: addPrice } = usePriceStore()
    const { assets, add: addAsset, totalChaos, totalDivines } = useAssetStore()

    return (
        <>
            <div className="flex">
                <DivinePrice amount={totalDivines()} size={42} className="flex-1 justify-center" />
                <ChaosPrice amount={totalChaos()} size={42} className="flex-1 justify-center" />
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
