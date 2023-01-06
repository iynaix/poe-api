import { useState } from "react"
import {
    useAssetStore,
    useTargetStore,
    type Target,
    estimatedTimeToTarget,
    usePriceStore,
    inflationInChaosPerHour,
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
    const { totalChaos } = useAssetStore()
    const [showDays, setShowDays] = useState(true)
    const EARN_RATE = 1000

    const eta = estimatedTimeToTarget(
        totalChaos(),
        price.chaosValue * target.count,
        EARN_RATE,
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
            {EARN_RATE > 0 && (
                <span
                    className="ml-auto mr-2"
                    onClick={() => {
                        setShowDays(!showDays)
                    }}
                >
                    {showDays
                        ? `${truncateFloat(eta, 3)} Days`
                        : `${truncateFloat(eta * 24, 3)} Hours`}
                </span>
            )}
        </div>
    )
}

export default InflationRow
