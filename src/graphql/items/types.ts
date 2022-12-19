import { ItemEndpointEnum } from "../../utils/constants"
import { Line } from "./ninja_types"

export type Item = Line & {
    relic: boolean
    endpoint: ItemEndpointEnum
}
