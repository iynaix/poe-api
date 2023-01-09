import TargetRow from "./target_row"
import { useTargetStore } from "../utils/progress_stores"

const TargetList = () => {
    const { targets } = useTargetStore()

    if (Object.keys(targets).length === 0) {
        return null
    }

    return (
        <div className="px-4 sm:px-6 lg:px-8">
            <div className="mt-8 flex flex-col">
                <div className="-my-2 -mx-4 overflow-x-hidden sm:-mx-6 lg:-mx-8">
                    <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
                        <div className="shadow ring-1 ring-surface1  md:rounded-lg">
                            <table className="min-w-full divide-y divide-surface1">
                                <tbody className="border-collapse divide-y divide-surface1">
                                    {Object.entries(targets).map(([targetId, target]) => (
                                        <TargetRow
                                            key={targetId}
                                            targetId={targetId}
                                            target={target}
                                        />
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default TargetList
