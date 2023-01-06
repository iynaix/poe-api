import { useId } from "react"
import { Inflation } from "../utils/progress_stores"
import Input from "./input"
import ToggleSelect from "./toggle_select"
import { DivineIcon, ChaosIcon } from "./poe_icon"

type ChaosRateInputProps = {
    label: string
    inflation: Inflation
    setInflation: (inflation: Inflation) => void
}

const ChaosRateInput = ({ label, inflation, setInflation }: ChaosRateInputProps) => {
    const randomId = useId()

    return (
        <div
            className="grid items-center gap-5"
            style={{
                gridTemplateColumns: "min-content min-content min-content auto",
            }}
        >
            <span>{label}</span>
            <div>
                <ToggleSelect
                    left={
                        <span className={inflation.period === "day" ? "text-white" : ""}>Day</span>
                    }
                    leftAltText="Day"
                    right={
                        <span className={inflation.period !== "day" ? "text-white" : ""}>Hour</span>
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
