import { useState } from "react"
import {
    useTargetStore,
    type Target,
    usePriceStore,
    inflationInChaosPerHour,
    useEarnRateStore,
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
    const { divineValue } = usePriceStore()
    const { add: addTarget } = useTargetStore()
    const { earnRateInChaosPerHour, estimatedTimeToTarget } = useEarnRateStore()
    const [showHours, setShowHours] = useState(true)

    const eta = estimatedTimeToTarget(
        price.chaosValue * target.count,
        inflationInChaosPerHour(target.inflation, divineValue)
    )

    return (
        <div className="flex items-center">
            <ChaosRateInput
                label="Increase Per"
                inflation={target.inflation}
                setInflation={(inflation) => {
                    addTarget(targetId, {
                        ...target,
                        inflation,
                    })
                }}
            />
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
