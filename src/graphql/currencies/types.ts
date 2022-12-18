import { Line, CurrencyDetail } from "./ninja_types"

export type LineWithChaos = Omit<Line, "chaosEquivalent"> & {
    chaosValue: number
}

export type Currency = LineWithChaos & { divineValue: number } & CurrencyDetail
