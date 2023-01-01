import type { ItemEndpointEnum } from "../../utils/constants"
import type { Line } from "./ninja_types"

export type Item = Line & {
    relic: boolean
    endpoint: ItemEndpointEnum
}
