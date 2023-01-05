import TargetRow from "./target_row"
import { useTargetStore } from "../utils/progress_stores"

export type TargetMap = Record<string, number>

const TargetList = () => {
    const { targets } = useTargetStore()

    return (
        <div>
            <div className="px-4 sm:px-6 lg:px-8">
                <div className="mt-8 flex flex-col">
                    <div className="-my-2 -mx-4 overflow-x-hidden sm:-mx-6 lg:-mx-8">
                        <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
                            <div className="shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                                <table className="min-w-full divide-y divide-gray-300">
                                    <tbody className="divide-y divide-gray-200">
                                        {Object.entries(targets).map(([targetId, count]) => (
                                            <TargetRow
                                                key={targetId}
                                                targetId={targetId}
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

export default TargetList
