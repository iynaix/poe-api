import PoeIcon from "./poe_icon"
import { usePriceStore, useTargetStore } from "../utils/progress_stores"

type TargetRowProps = {
    targetId: string
    count: number
}

const TargetRow = ({ targetId, count }: TargetRowProps) => {
    const { getById, remove: removePrice } = usePriceStore()
    const { add: addTarget, remove: removeTarget } = useTargetStore()

    const price = getById(targetId)

    return (
        <label htmlFor={price.name} className="block">
            {price.icon && <PoeIcon icon={price.icon} alt={price.name} size={36} />}
            <span className="text-gray-50">{price.name}</span>
            <input
                className="bg-gray-800 text-gray-50"
                type="number"
                name={price.name}
                value={count}
                min={0}
                onChange={(ev) => addTarget(price.id, Number(ev.target.value))}
            />

            <span
                className="ml-2"
                onClick={() => {
                    removeTarget(targetId)
                    removePrice(targetId)
                }}
            >
                x
            </span>
        </label>
    )
}

export default TargetRow
