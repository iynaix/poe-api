export interface NinjaStash {
    lines: Line[]
}

export interface Line {
    id: number
    name: string
    icon: string
    baseType: string
    corrupted: boolean
    gemLevel: number
    gemQuality: number
    variant?: string
    itemClass: number
    sparkLine: SparkLine
    lowConfidenceSparkLine: LowConfidenceSparkLine
    implicitModifiers: ImplicitModifier[]
    explicitModifiers: ExplicitModifier[]
    mutatedModifiers: MutatedModifier[]
    flavourText: string
    itemType: string
    chaosValue: number
    exaltedValue: number
    divineValue: number
    count: number
    detailsId: string
    tradeInfo: TradeInfo[]
    listingCount: number
    levelRequired?: number
    links?: number
}

export interface SparkLine {
    totalChange: number
    data: number | undefined[]
}

export interface LowConfidenceSparkLine {
    totalChange: number
    data: number | undefined[]
}

export interface ImplicitModifier {
    text: string
    optional: boolean
}

export interface ExplicitModifier {
    text: string
    optional: boolean
}

export interface MutatedModifier {
    text: string
    optional: boolean
}

export interface TradeInfo {
    mod: string
    min: number
    max: number
}
