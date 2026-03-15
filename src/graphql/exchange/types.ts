import type { ExchangeEndpointEnum } from "../../utils/constants"
import type { Line, Item } from "./ninja_types"

export type LineWithChaos = Line & {
    endpoint: ExchangeEndpointEnum
}

export type Currency = Item & LineWithChaos & { chaosValue: number; divineValue: number }
