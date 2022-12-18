export interface NinjaCurrency {
    lines: Line[]
    currencyDetails: CurrencyDetail[]
}

export interface Line {
    currencyTypeName: string
    pay?: Pay
    receive: Receive
    paySparkLine: PaySparkLine
    receiveSparkLine: ReceiveSparkLine
    chaosEquivalent: number
    lowConfidencePaySparkLine: LowConfidencePaySparkLine
    lowConfidenceReceiveSparkLine: LowConfidenceReceiveSparkLine
    detailsId: string
}

export interface Pay {
    id: number
    league_id: number
    pay_currency_id: number
    get_currency_id: number
    sample_time_utc: string
    count: number
    value: number
    data_point_count: number
    includes_secondary: boolean
    listing_count: number
}

export interface Receive {
    id: number
    league_id: number
    pay_currency_id: number
    get_currency_id: number
    sample_time_utc: string
    count: number
    value: number
    data_point_count: number
    includes_secondary: boolean
    listing_count: number
}

export interface PaySparkLine {
    data: number | undefined[]
    totalChange: number
}

export interface ReceiveSparkLine {
    data: number[]
    totalChange: number
}

export interface LowConfidencePaySparkLine {
    data: number | undefined[]
    totalChange: number
}

export interface LowConfidenceReceiveSparkLine {
    data: number[]
    totalChange: number
}

export interface CurrencyDetail {
    id: number
    icon?: string
    name: string
    tradeId?: string
}
