import AssetRow from "./asset_row"
import { useAssetStore } from "../utils/progress_stores"

const AssetList = () => {
    const { assets } = useAssetStore()

    return (
        <div>
            <div className="px-4 sm:px-6 lg:px-8">
                <div className="mt-8 flex flex-col">
                    <div className="-my-2 -mx-4 overflow-x-hidden sm:-mx-6 lg:-mx-8">
                        <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
                            <div className="shadow ring-1 ring-surface1  md:rounded-lg">
                                <table className="min-w-full divide-y divide-surface1">
                                    <tbody className="border-collapse divide-y divide-surface1">
                                        {Object.entries(assets).map(([assetId, asset]) => (
                                            <AssetRow
                                                key={assetId}
                                                assetId={assetId}
                                                asset={asset}
                                            />
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AssetList
