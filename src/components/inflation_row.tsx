import { useState } from "react"
import {
    type Target,
    usePricesActions,
    useTargetsActions,
    useEarnRateActions,
} from "../utils/progress_stores"
import type { Price } from "../server/trpc/router/prices"
import ChaosRateInput from "./chaos_rate_input"
import { truncateFloat } from "../utils"

type InflationRowProps = {
    targetId: string
    target: Target
    price: Price
}

const InflationRow = ({ targetId, target, price }: InflationRowProps) => {
    const { inflationInChaosPerHour } = usePricesActions()
    const { add: addTarget } = useTargetsActions()
    const { earnRateInChaosPerHour, estimatedTimeToTarget } = useEarnRateActions()
    const [showHours, setShowHours] = useState(true)

    const eta = estimatedTimeToTarget(
        price.chaosValue * target.count,
        inflationInChaosPerHour(target.inflation)
    )

    return (
        <div className="flex items-center">
            <div className="flex items-center">
                <span className="pr-4">Increase Per</span>
                <ChaosRateInput
                    inflation={target.inflation}
                    setInflation={(inflation) => {
                        addTarget(targetId, {
                            ...target,
                            inflation,
                        })
                    }}
                />
            </div>

            {earnRateInChaosPerHour() > 0 && (
                <span
                    className="ml-auto mr-2"
                    onClick={() => {
                        setShowHours(!showHours)
                    }}
                >
                    {showHours
                        ? `${truncateFloat(eta, 3)} Hours`
                        : `${truncateFloat(eta / 24, 3)} Days`}
                </span>
            )}
        </div>
    )
}

export default InflationRow
