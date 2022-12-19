export const NINJA_API_URL = "https://poe.ninja"

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

export const CURRENCY_ENDPOINTS = ["Currency", "Fragment"]

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
]
