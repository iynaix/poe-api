import { useState } from "react"
import { type Target, priceStore, targetStore, earnRateStore } from "../utils/progress_stores"
import type { Price } from "../server/trpc/router/prices"
import ChaosRateInput from "./chaos_rate_input"
import { truncateFloat } from "../utils"

type InflationRowProps = {
    targetId: string
    target: Target
    price: Price
}

const InflationRow = ({ targetId, target, price }: InflationRowProps) => {
    const [showHours, setShowHours] = useState(true)

    const eta = earnRateStore.get.estimatedTimeToTarget(
        price.chaosValue * target.count,
        priceStore.get.inflationInChaosPerHour(target.inflation)
    )

    return (
        <div className="flex items-center">
            <div className="flex items-center">
                <span className="pr-4">Increase Per</span>
                <ChaosRateInput
                    inflation={target.inflation}
                    setInflation={(inflation) => {
                        targetStore.set.add(targetId, {
                            ...target,
                            inflation,
                        })
                    }}
                    // allow for deflation
                    min={-1000000}
                />
            </div>

            {earnRateStore.get.earnRateInChaosPerHour() > 0 && (
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
