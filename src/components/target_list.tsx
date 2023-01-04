import SearchById from "./search_by_id"
import TargetRow from "./target_row"
import { truncateFloat } from "../utils"
import { useAssetStore, useTargetStore } from "../utils/progress_stores"

const TargetList = () => {
    const { totalChaos } = useAssetStore()
    const { targets, totalChaos: targetChaos, add: addTarget } = useTargetStore()

    const totalTargetChaos = targetChaos()
    // no divide by zero
    const progress = totalTargetChaos ? (totalChaos() / targetChaos()) * 100 : 0

    return (
        <>
            <div className="grid grid-cols-1 gap-6">
                {Object.entries(targets).map(([targetId, count]) => {
                    return <TargetRow key={targetId} targetId={targetId} count={count} />
                })}

                <span className="">Progess: {truncateFloat(progress, 5)}%</span>
            </div>

            <SearchById
                label="Add Target"
                onClick={(price) => {
                    addTarget(price.id, 1)
                }}
            />
        </>
    )
}

export default TargetList
