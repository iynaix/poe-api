export interface NinjaSearch {
    items: SearchCategories
}

export interface SearchCategories {
    UniqueArmour: SearchResult[]
    UniqueAccessory: SearchResult[]
    SkillGem: SearchResult[]
    BaseType: SearchResult[]
    Fossil: SearchResult[]
    Resonator: SearchResult[]
    Scarab: SearchResult[]
    Beast: SearchResult[]
    Incubator: SearchResult[]
    Oil: SearchResult[]
    Vial: SearchResult[]
    DeliriumOrb: SearchResult[]
    Invitation: SearchResult[]
    BlightedMap: SearchResult[]
    ClusterJewel: SearchResult[]
    Artifact: SearchResult[]
    BlightRavagedMap: SearchResult[]
    ScourgedMap: SearchResult[]
    Tattoo: SearchResult[]
    Omen: SearchResult[]
    UniqueRelic: SearchResult[]
    Memory: SearchResult[]
    IncursionTemple: SearchResult[]
    Coffin: SearchResult[]
    Currency: SearchResult[]
    Fragment: SearchResult[]
    DivinationCard: SearchResult[]
    Essence: SearchResult[]
    UniqueMap: SearchResult[]
    Map: SearchResult[]
    UniqueJewel: SearchResult[]
    UniqueFlask: SearchResult[]
    UniqueWeapon: SearchResult[]
    AllflameEmber: SearchResult[]
    KalguuranRune: SearchResult[]
    UniqueIdol: SearchResult[]
    UniqueTincture: SearchResult[]
    Runegraft: SearchResult[]
    Wombgift: SearchResult[]
    ForbiddenJewel: SearchResult[]
    ValdoMap: SearchResult[]
    DjinnCoin: SearchResult[]
    Astrolabe: SearchResult[]
    ShrineBelt: SearchResult[]
}

export interface SearchResult {
    name: string
    icon: string
}
