import Button from "./button"
import PaneHeader from "./pane_header"
import SearchPalette from "./search_palette"
import TargetList from "./target_list"
import { useState } from "react"
import { useTargetStore, useAssetStore, useEarnRateStore } from "../utils/progress_stores"
import { ChartBarIcon, CalendarDaysIcon, ClockIcon } from "@heroicons/react/24/outline"
import Stat from "./stat"
import { truncateFloat } from "../utils"
import PoeIcon, { DIVINE_ICON, CHAOS_ICON } from "./poe_icon"
import ChaosRateInput from "./chaos_rate_input"

const TargetPanel = () => {
    const { totalChaos } = useAssetStore()
    const {
        add: addTarget,
        totalChaos: targetTotalChaos,
        totalDivines: targetTotalDivines,
        totalInflationRate,
    } = useTargetStore()

    const {
        earnRate,
        set: setEarnRate,
        earnRateInChaosPerHour,
        estimatedTimeToTarget,
    } = useEarnRateStore()
    const [showDivineStat, setShowDivineStat] = useState(true)
    const [showHourStat, setShowHourStat] = useState(true)
    const [openTargetSearchModal, setTargetOpenSearchModal] = useState(false)

    const targetChaos = targetTotalChaos()
    // no divide by zero
    const progress = targetChaos ? (totalChaos() / targetChaos) * 100 : 0

    const showETA = earnRateInChaosPerHour() > 0
    const etaInHours = estimatedTimeToTarget(targetChaos, totalInflationRate())

    return (
        <div className="p-4">
            <PaneHeader className="hidden md:visible">I Want</PaneHeader>

            <div className="mx-auto mt-8 flex items-center justify-around">
                <span>Earn Rate</span>

                <ChaosRateInput
                    className="px-0 md:px-8"
                    inflation={earnRate}
                    setInflation={setEarnRate}
                />
            </div>

            <dl
                className="mt-8 grid gap-5"
                style={{
                    gridTemplateColumns: `repeat(${showETA ? 3 : 2}, minmax(0, 1fr))`,
                }}
            >
                <Stat name="Progress" icon={<ChartBarIcon className="my-2 h-10 w-10" />}>
                    {truncateFloat(progress, 3)}%
                </Stat>
                {showETA && (
                    <Stat
                        name={`ETA (${showHourStat ? "Hours" : "Days"})`}
                        icon={
                            showHourStat ? (
                                <ClockIcon className="my-2 h-10 w-10" />
                            ) : (
                                <CalendarDaysIcon className="my-2 h-10 w-10" />
                            )
                        }
                        onClick={() => {
                            setShowHourStat(!showHourStat)
                        }}
                    >
                        {truncateFloat(showHourStat ? etaInHours : etaInHours / 24, 3)}
                    </Stat>
                )}
                <Stat
                    name="Target"
                    icon={
                        <PoeIcon
                            icon={showDivineStat ? DIVINE_ICON : CHAOS_ICON}
                            alt={showDivineStat ? "Divine Orb" : "Chaos Orb"}
                            size={48}
                        />
                    }
                    onClick={() => {
                        setShowDivineStat(!showDivineStat)
                    }}
                >
                    {truncateFloat(showDivineStat ? targetTotalDivines() : targetChaos, 3)}
                </Stat>
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
