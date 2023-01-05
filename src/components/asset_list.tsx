import AssetRow from "./asset_row"
import SearchById from "./search_by_id"
import { ChaosPrice, DivinePrice, DIVINE_ICON, CHAOS_ICON } from "./poe_icon"
import { usePriceStore, useAssetStore } from "../utils/progress_stores"
import AssetStat from "./asset_stat"
import { truncateFloat } from "../utils"

export type AssetMap = Record<string, number>

const AssetListOld = () => {
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

const AssetStats = () => {
    const stats = [
        {
            id: 1,
            name: "Total Subscribers",
            stat: "71,897",
            change: "122",
            changeType: "increase",
        },
        {
            id: 2,
            name: "Avg. Open Rate",
            stat: "58.16%",
            change: "5.4%",
            changeType: "increase",
        },
    ]

    return (
        <div>
            <dl className="mt-5 grid grid-cols-2 gap-5">
                {stats.map((item) => (
                    <div
                        key={item.id}
                        className="relative overflow-hidden rounded-lg px-4 pt-5 pb-12 shadow bg-white sm:px-6 sm:pt-6"
                    >
                        <dt>
                            <div className="absolute rounded-md p-3 bg-indigo-500">
                                {/* <item.icon className="h-6 w-6 text-white" aria-hidden="true" /> */}
                            </div>
                            <p className="ml-16 truncate text-sm font-medium text-slate-600">
                                {item.name}
                            </p>
                        </dt>
                        {/* <dd className="ml-16 flex items-baseline pb-6 sm:pb-7">
                            <p className="text-2xl font-semibold text-gray-900">{item.stat}</p>
                            <div className="absolute inset-x-0 bottom-0 bg-gray-50 px-4 py-4 sm:px-6">
                                <div className="text-sm">
                                    <a
                                        href="#"
                                        className="font-medium text-indigo-600 hover:text-indigo-500"
                                    >
                                        {" "}
                                        View all<span className="sr-only"> {item.name} stats</span>
                                    </a>
                                </div>
                            </div>
                        </dd> */}
                    </div>
                ))}
            </dl>
        </div>
    )
}

const AssetList = () => {
    const { add: addPrice } = usePriceStore()
    const { assets, add: addAsset, totalChaos, totalDivines } = useAssetStore()

    return (
        <>
            <div>
                <dl className="mt-5 grid grid-cols-2 gap-5">
                    <AssetStat
                        name="Divine Orb"
                        stat={totalDivines()}
                        iconProps={{
                            icon: DIVINE_ICON,
                            alt: "Divine Orb",
                            size: 48,
                        }}
                    />
                    <AssetStat
                        name="Chaos Orb"
                        stat={totalChaos()}
                        iconProps={{
                            icon: CHAOS_ICON,
                            alt: "Chaos Orb",
                            size: 48,
                        }}
                    />
                </dl>
            </div>
            <div className="px-4 sm:px-6 lg:px-8">
                <div className="mt-8 flex flex-col">
                    <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
                        <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
                            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                                <table className="min-w-full divide-y divide-gray-300">
                                    <tbody className="divide-y divide-gray-200">
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
        </>
    )
}

export default AssetList
