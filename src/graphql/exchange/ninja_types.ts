export interface NinjaExchange {
    core: Core
    lines: Line[]
    items: Item[]
}

export interface Core {
    items: CoreItem[]
    rates: Rates
    primary: string
    secondary: string
}

export interface CoreItem {
    id: string
    name: string
    image: string
    category: string
    detailsId: string
}

export interface Rates {
    divine: number
}

export interface Line {
    id: string
    primaryValue: number
    volumePrimaryValue: number
    maxVolumeCurrency: string
    maxVolumeRate: number
    sparkline: Sparkline
}

export interface Sparkline {
    totalChange: number
    data: number | undefined[]
}

export interface Item {
    id: string
    name: string
    image: string
    category: string
    detailsId: string
}
