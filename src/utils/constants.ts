export const NINJA_API_URL = "https://poe.ninja"

export const CACHE_THRESHOLD = process.env.NODE_ENV === "production" ? 10 * 60 : 60 * 60

const TMPSTANDARD = "Mirage"

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

export const EXCHANGE_ENDPOINTS = [
    // General
    "Currency",
    "Fragment",
    "Runegraft",
    "AllflameEmber",
    "Tattoo",
    "Omen",
    "DjinnCoins",
    "DivinationCard",
    "Artifact",
    "Oil",
    // Atlas
    "DeliriumOrb",
    // Crafting
    "Fossil",
    "Resonator",
    "Essence",
] as const

export type ExchangeEndpointEnum = (typeof EXCHANGE_ENDPOINTS)[number]

export const STASH_ENDPOINTS = [
    // General
    "Wombgift",
    "Incubator",
    // Equipment & Gems
    "UniqueWeapon",
    "UniqueArmour",
    "UniqueAccessory",
    "UniqueFlask",
    "UniqueJewel",
    "ForbiddenJewel",
    "UniqueTincture",
    "UniqueRelic",
    "SkillGem",
    "ClusterJewel",
    // Atlas
    "Map",
    "BlightedMap",
    "BlightRavagedMap",
    "UniqueMap",
    "ValdoMap",
    "Invitation",
    "Scarab",
    "Astrolabe",
    // "Memory", // no longer available
    // Crafting
    "BaseType",
    "Beast",
    "Vial",
] as const

export type StashEndpointEnum = (typeof STASH_ENDPOINTS)[number]
