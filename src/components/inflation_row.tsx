import React from "react"
import { type Target } from "../utils/progress_stores"
import Input from "./input"
import ToggleSelect from "./toggle_select"
import { DivineIcon, ChaosIcon } from "./poe_icon"

type InflationRowProps = {
    targetId: string
    target: Target
}

const InflationRow = ({ targetId, target }: InflationRowProps) => {
    const [period, setPeriod] = React.useState<0 | 1>(target.inflation.period === "day" ? 0 : 1)
    const [currencyType, setCurrencyType] = React.useState<0 | 1>(
        target.inflation.currencyType === "divine" ? 0 : 1
    )

    return (
        <div className="grid grid-flow-col items-center">
            <p>Increase Per</p>
            <ToggleSelect
                left={<span className={period === 0 ? "text-white" : ""}>Day</span>}
                leftAltText="Day"
                right={<span className={period !== 0 ? "text-white" : ""}>Hour</span>}
                rightAltText="Hour"
                selection={period}
                setSelection={setPeriod}
            />
            <Input
                type="number"
                name={`${targetId}-inflation`}
                value={target.inflation.rate}
                onChange={() => {
                    return
                }}
            />
            <ToggleSelect
                left={<DivineIcon size={20} />}
                leftAltText="Divine"
                right={<ChaosIcon size={20} />}
                rightAltText="Chaos"
                selection={currencyType}
                setSelection={setCurrencyType}
            />
        </div>
    )
}

export default InflationRow
