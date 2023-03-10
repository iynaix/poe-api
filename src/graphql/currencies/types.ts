import type { CurrencyEndpointEnum } from "../../utils/constants"
import type { Line, CurrencyDetail } from "./ninja_types"

export type LineWithChaos = Omit<Line, "chaosEquivalent"> & {
    chaosValue: number
    endpoint: CurrencyEndpointEnum
}

export type Currency = LineWithChaos & { divineValue: number } & CurrencyDetail
