export interface NinjaItems {
    lines: Line[]
}

export interface Line {
    id: number
    name: string
    icon: string
    levelRequired?: number
    baseType?: string
    itemClass: number
    sparkline: Sparkline
    lowConfidenceSparkline: LowConfidenceSparkline
    implicitModifiers: ImplicitModifier[]
    explicitModifiers: ExplicitModifier[]
    flavourText: string
    itemType: string
    chaosValue: number
    exaltedValue: number
    divineValue: number
    count: number
    detailsId: string
    listingCount: number
    links?: number
    variant?: string
}

export interface Sparkline {
    data: number | undefined[]
    totalChange: number
}

export interface LowConfidenceSparkline {
    data: number | undefined[]
    totalChange: number
}

export interface ImplicitModifier {
    text: string
    optional: boolean
}

export interface ExplicitModifier {
    text: string
    optional: boolean
}
