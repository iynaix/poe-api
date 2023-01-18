export const NINJA_API_URL = "https://poe.ninja"

export const CACHE_THRESHOLD = process.env.NODE_ENV === "production" ? 10 * 60 : 60 * 60

const TMPSTANDARD = "Sanctum"

export const LEAGUES = {
    tmpstandard: TMPSTANDARD,
    tmpruthless: `Ruthless ${TMPSTANDARD}`,
    tmphardcore: `Hardcore ${TMPSTANDARD}`,
    tmphardcoreruthless: `Hardcore Ruthless ${TMPSTANDARD}`,
    standard: "Standard",
    hardcore: "Hardcore",
    ruthless: "Ruthless",
    hardcoreruthless: "Hardcore Ruthless",
} as const

export const CURRENCY_ENDPOINTS = ["Currency", "Fragment"] as const

export type CurrencyEndpointEnum = (typeof CURRENCY_ENDPOINTS)[number]

export const ITEM_ENDPOINTS = [
    // General
    "DivinationCard",
    "Artifact",
    "Oil",
    "Incubator",
    // Equipment & Gems
    "UniqueWeapon",
    "UniqueArmour",
    "UniqueAccessory",
    "UniqueFlask",
    "UniqueJewel",
    "SkillGem",
    "ClusterJewel",
    // Atlas
    "Map",
    "BlightedMap",
    "BlightRavagedMap",
    "UniqueMap",
    "DeliriumOrb",
    "Invitation",
    "Scarab",
    // Crafting
    "BaseType",
    "Fossil",
    "Resonator",
    "HelmetEnchant",
    "Beast",
    "Essence",
    "Vial",
] as const

export type ItemEndpointEnum = (typeof ITEM_ENDPOINTS)[number]
