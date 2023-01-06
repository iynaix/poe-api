import Button from "./button"
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
        totalEsimatedTimeToTarget,
    } = useTargetStore()

    const [showDivineStat, setShowDivineStat] = useState(true)
    const [openTargetSearchModal, setTargetOpenSearchModal] = useState(false)

    const targetChaos = targetTotalChaos()
    // no divide by zero
    const progress = targetChaos ? (totalChaos() / targetChaos) * 100 : 0

    console.log("ETA", totalEsimatedTimeToTarget())

    return (
        <div className="p-4">
            <PaneHeader>I Want</PaneHeader>

            <dl className="mt-5 grid grid-cols-2 gap-5">
                <Stat name="Progress" icon={<ChartBarIcon className="my-2 h-10 w-10" />}>
                    {truncateFloat(progress, 3)}%
                </Stat>
                {showDivineStat ? (
                    <Stat
                        name="Divine Orb"
                        icon={<PoeIcon icon={DIVINE_ICON} alt="Divine Orb" size={48} />}
                        onClick={() => {
                            setShowDivineStat(!showDivineStat)
                        }}
                    >
                        {truncateFloat(targetTotalDivines(), 3)}
                    </Stat>
                ) : (
                    <Stat
                        name="Chaos Orb"
                        icon={<PoeIcon icon={CHAOS_ICON} alt="Chaos Orb" size={48} />}
                        onClick={() => {
                            setShowDivineStat(!showDivineStat)
                        }}
                    >
                        {truncateFloat(targetChaos, 0)}
                    </Stat>
                )}
            </dl>

            <TargetList />

            <div className="mt-4 flex flex-col p-8">
                <Button
                    className="w-full justify-center"
                    onClick={() => {
                        setTargetOpenSearchModal(!openTargetSearchModal)
                    }}
                >
                    Add Item
                </Button>
            </div>

            <SearchPalette
                open={openTargetSearchModal}
                setOpen={setTargetOpenSearchModal}
                onSelect={(price) => {
                    // default count to 1
                    addTarget(price.id, {
                        count: 1,
                        inflation: {
                            currencyType: "divine",
                            period: "day",
                            rate: 0,
                        },
                    })
                }}
            />
        </div>
    )
}
export default TargetPanel
