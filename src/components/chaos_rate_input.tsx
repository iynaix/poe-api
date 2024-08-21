import { useId } from "react"
import type { Inflation } from "../utils/progress_stores"
import Input from "./input"
import ToggleSelect from "./toggle_select"
import { DivineIcon, ChaosIcon } from "./poe_icon"

type ChaosRateInputProps = {
    className?: string
    inflation: Inflation
    setInflation: (inflation: Inflation) => void
    min?: number
}

const ChaosRateInput = ({ className, inflation, setInflation, min = 0 }: ChaosRateInputProps) => {
    const randomId = useId()

    return (
        <div className={`grid grid-cols-3 justify-items-center gap-5 ${className}`}>
            <div>
                <ToggleSelect
                    left={
                        <span className={inflation.period === "day" ? "text-crust" : ""}>Day</span>
                    }
                    leftAltText="Day"
                    right={
                        <span className={inflation.period !== "day" ? "text-crust" : ""}>Hour</span>
                    }
                    rightAltText="Hour"
                    selection={inflation.period === "day"}
                    setSelection={(selection) => {
                        setInflation({
                            ...inflation,
                            period: selection ? "day" : "hour",
                        })
                    }}
                />
            </div>
            <div>
                <Input
                    type="number"
                    name={`${randomId}-inflation`}
                    value={inflation.rate}
                    min={min}
                    onChange={(ev) => {
                        setInflation({
                            ...inflation,
                            rate: Number(ev.target.value),
                        })
                    }}
                />
            </div>
            <div>
                <ToggleSelect
                    left={<DivineIcon size={20} />}
                    leftAltText="Divine"
                    right={<ChaosIcon size={20} />}
                    rightAltText="Chaos"
                    selection={inflation.currencyType === "divine"}
                    setSelection={(selection) => {
                        setInflation({
                            ...inflation,
                            currencyType: selection ? "divine" : "chaos",
                        })
                    }}
                />
            </div>
        </div>
    )
}

export default ChaosRateInput
