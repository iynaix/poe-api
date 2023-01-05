import PoeIcon, { type PoeIconProps } from "./poe_icon"
import { truncateFloat } from "../utils"

type AssetStatProps = {
    name: string
    stat: number
    places?: number
    iconProps: PoeIconProps
}

const AssetStat = ({ name, stat, iconProps, places = 3 }: AssetStatProps) => {
    return (
        <div className="relative overflow-hidden rounded-lg px-4 pt-5 pb-12 shadow bg-white">
            <dt>
                <div className="absolute px-3">
                    <PoeIcon {...iconProps} />
                </div>
                <p className="ml-16 truncate text-sm font-medium text-gray-500">{name}</p>
            </dt>
            <dd className="ml-16 flex items-baseline">
                <p className="text-2xl font-semibold text-gray-900">
                    {truncateFloat(stat, places)}
                </p>
            </dd>
        </div>
    )
}

export default AssetStat
