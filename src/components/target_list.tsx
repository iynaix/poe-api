import { useMap } from "react-use"
import type { Price } from "../server/trpc/router/prices"
import SearchById from "./search_by_id"
import AssetRow from "./asset_row"
import { truncateFloat } from "../utils"

type Target = {
    price: Price
    count: number
}

type TargetListProps = {
    divineValue: number
    totalChaos: number
}

const useTargets = ({ divineValue: divinePrice, totalChaos }: TargetListProps) => {
    const [targets, operations] = useMap<Record<string, Target>>()

    const targetChaos = Object.values(targets).reduce((acc, target) => {
        return acc + target.count * target.price.chaosValue
    }, 0)

    return {
        assets: targets,
        ...operations,
        targetDivines: targetChaos / divinePrice,
        targetChaos,
        overallPercent: totalChaos / targetChaos,
    }
}

const TargetList = ({ divineValue: divinePrice, totalChaos }: TargetListProps) => {
    const {
        assets,
        set: setAsset,
        remove: removeAsset,
        overallPercent,
        targetChaos,
    } = useTargets({ divineValue: divinePrice, totalChaos })

    const progress = targetChaos ? (overallPercent || 0) * 100 : 0

    return (
        <>
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

                <span className="">Progess: {truncateFloat(progress, 5)}%</span>
            </div>

            <SearchById
                label="Add Target"
                onClick={(price) => {
                    setAsset(price.id, { price, count: 1 })
                }}
            />
        </>
    )
}

export default TargetList
