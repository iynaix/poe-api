import type { CurrencyEndpointEnum, ItemEndpointEnum } from "../../utils/constants"

export type Combined = {
    id: string
    name: string
    icon?: string
    chaosValue: number
    divineValue: number
    endpoint: CurrencyEndpointEnum | ItemEndpointEnum
}
