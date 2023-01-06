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
                            <div className="shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                                <table className="min-w-full divide-y divide-gray-300">
                                    <tbody className="border-collapse divide-y divide-gray-200">
                                        {Object.entries(assets).map(([assetId, count]) => (
                                            <AssetRow
                                                key={assetId}
                                                assetId={assetId}
                                                count={count}
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
