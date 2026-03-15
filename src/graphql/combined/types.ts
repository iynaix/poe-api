import type { ExchangeEndpointEnum, StashEndpointEnum } from "../../utils/constants"

export type Combined = {
    id: string
    name: string
    icon?: string
    chaosValue: number
    divineValue: number
    endpoint: ExchangeEndpointEnum | StashEndpointEnum
}
