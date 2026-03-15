import type { StashEndpointEnum } from "../../utils/constants"
import type { Line } from "./ninja_types"

export type Item = Line & {
    relic: boolean
    endpoint: StashEndpointEnum
}
