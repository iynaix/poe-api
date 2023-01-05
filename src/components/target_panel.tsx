import PaneHeader from "./pane_header"
import SearchPalette from "./search_palette"
import TargetList from "./target_list"
import { useState } from "react"
import { useTargetStore, useAssetStore } from "../utils/progress_stores"
import { ChartBarIcon } from "@heroicons/react/24/outline"
import Stat from "./stat"
import { truncateFloat } from "../utils"
import PoeIcon, { DIVINE_ICON, CHAOS_ICON } from "./poe_icon"

const TargetPanel = () => {
    const { totalChaos } = useAssetStore()
    const {
        add: addTarget,
        totalChaos: targetTotalChaos,
        totalDivines: targetTotalDivines,
    } = useTargetStore()

    const [openTargetSearchModal, setTargetOpenSearchModal] = useState(false)

    // no divide by zero
    const targetChaos = targetTotalChaos()
    const progress = targetChaos ? (totalChaos() / targetChaos) * 100 : 0

    return (
        <div className="p-4">
            <PaneHeader
                right={
                    <button
                        type="button"
                        className="inline-flex items-center rounded-md border px-4 py-2 text-sm font-medium shadow-sm border-transparent text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        onClick={() => {
                            setTargetOpenSearchModal(!openTargetSearchModal)
                        }}
                    >
                        Add
                    </button>
                }
            >
                I Want
            </PaneHeader>

            <dl className="mt-5 grid grid-cols-3 gap-5">
                <Stat name="Progress" icon={<ChartBarIcon className="my-2 h-10 w-10" />}>
                    {truncateFloat(progress, 3)}%
                </Stat>
                <Stat
                    name="Divine Orb"
                    icon={<PoeIcon icon={DIVINE_ICON} alt="Divine Orb" size={48} />}
                >
                    {truncateFloat(targetTotalDivines(), 3)}
                </Stat>
                <Stat
                    name="Chaos Orb"
                    icon={<PoeIcon icon={CHAOS_ICON} alt="Chaos Orb" size={48} />}
                >
                    {truncateFloat(targetChaos, 0)}
                </Stat>
            </dl>

            <TargetList />

            <SearchPalette
                open={openTargetSearchModal}
                setOpen={setTargetOpenSearchModal}
                onSelect={(price) => {
                    // default count to 1
                    addTarget(price.id, 1)
                }}
            />
        </div>
    )
}
export default TargetPanel
