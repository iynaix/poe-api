import { type Target, priceStore, targetStore } from "../utils/progress_stores"
import { TrashIcon, CurrencyDollarIcon } from "@heroicons/react/24/outline"
import { PoeIconText, TogglePrice } from "./poe_icon"
import { useState } from "react"
import InflationRow from "./inflation_row"
import Input from "./input"

type TargetRowProps = {
    targetId: string
    target: Target
}

const TargetRow = ({ targetId, target }: TargetRowProps) => {
    const [showInflation, setShowInflation] = useState(false)

    const price = priceStore.get.priceById(targetId)

    return (
        <>
            <tr>
                <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-6">
                    <PoeIconText
                        iconProps={{
                            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                            icon: price.icon!,
                            alt: price.name,
                            size: 36,
                        }}
                        text={price.name}
                        secondary={
                            <TogglePrice
                                className="mt-1 opacity-60"
                                divineValue={price.divineValue}
                                chaosValue={price.chaosValue}
                                size={15}
                            />
                        }
                    />
                </td>
                <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                    <div>
                        <label htmlFor={price.name} className="sr-only">
                            {price.name}
                        </label>
                        <Input
                            type="number"
                            name={price.name}
                            value={target.count}
                            onChange={(ev) =>
                                targetStore.set.add(price.id, {
                                    count: Number(ev.target.value),
                                    inflation: {
                                        currencyType: "divine",
                                        period: "day",
                                        rate: 0,
                                    },
                                })
                            }
                        />
                    </div>
                </td>
                <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                    <CurrencyDollarIcon
                        className="h-5 w-5 cursor-pointer text-blue"
                        aria-hidden="true"
                        onClick={() => {
                            setShowInflation(!showInflation)
                        }}
                    />
                </td>
                <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                    <TrashIcon
                        className="h-5 w-5 cursor-pointer text-maroon"
                        aria-hidden="true"
                        onClick={() => {
                            targetStore.set.remove(targetId)
                        }}
                    />
                </td>
            </tr>
            {showInflation && (
                <tr>
                    <td colSpan={10} className="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-6">
                        <InflationRow targetId={targetId} target={target} price={price} />
                    </td>
                </tr>
            )}
        </>
    )
}

export default TargetRow
