import LZString from "lz-string"
import type { LeagueName } from "."
import type { Asset, Inflation, Target } from "./progress_stores"
import { earnRateStore, priceStore, assetStore, targetStore } from "./progress_stores"

const _serializeInflation = (inflation: Inflation) => {
    if (inflation.rate === 0) {
        return ""
    }

    return `${inflation.currencyType[0]},${inflation.period[0]},${inflation.rate}`
}

const _deserializeInflation = (inflation: string): Inflation => {
    const [currencyType, period, rate] = inflation.split(",")

    return {
        currencyType: currencyType === "d" ? "divine" : "chaos",
        period: period === "d" ? "day" : "hour",
        rate: parseFloat(rate || "0"),
    }
}

const _serializeAssets = (assets: Record<string, Asset>) => {
    return Object.entries(assets)
        .map(([id, asset]) => {
            return `${id},${asset.count}`
        })
        .join("|")
}

const _deserializeAssets = (assets: string) => {
    const ret: Record<string, Asset> = {}
    assets.split("|").map((asset) => {
        const [id, count] = asset.split(",")
        if (id) {
            ret[id] = { count: parseInt(count || "0") }
        }
    })
    return ret
}

const _serializeTargets = (targets: Record<string, Target>) => {
    return Object.entries(targets)
        .map(([id, target]) => {
            return `${id},${target.count},${_serializeInflation(target.inflation)}`
        })
        .join("|")
}

const _deserializeTargets = (targets: string) => {
    const ret: Record<string, Target> = {}
    targets.split("|").map((target) => {
        const [id, count, inflation] = target.split(",")
        if (id) {
            ret[id] = {
                count: parseInt(count || "0"),
                inflation: _deserializeInflation(inflation || ""),
            }
        }
    })
    return ret
}

type SavedProgressState = Partial<{
    // earnRate
    e: string
    // league
    l: LeagueName
    // assets
    a: string
    // targets
    t: string
}>

export const useExport = () => {
    const earnRate = earnRateStore.use.earnRate()
    const league = priceStore.use.league()
    const assets = assetStore.use.assets()
    const targets = targetStore.use.targets()

    const serialize = (): SavedProgressState => {
        const savedState: SavedProgressState = {}

        if (earnRate.rate !== 0) {
            savedState.e = _serializeInflation(earnRate)
        }

        if (league !== "tmpstandard") {
            savedState.l = league
        }

        if (Object.keys(assets).length > 0) {
            savedState.a = _serializeAssets(assets)
        }

        if (Object.keys(targets).length > 0) {
            savedState.t = _serializeTargets(targets)
        }

        return savedState
    }

    const deserialize = (state: SavedProgressState) => {
        return {
            earnRate: state.e
                ? _deserializeInflation(state.e)
                : {
                      currencyType: "divine",
                      period: "day",
                      rate: 0,
                  },
            league: state.l || "tmpstandard",
            assets: state.a ? _deserializeAssets(state.a) : {},
            targets: state.t ? _deserializeTargets(state.t) : {},
        }
    }

    const toUrl = () => {
        const encodedState = LZString.compressToEncodedURIComponent(JSON.stringify(serialize()))
        return `${window.location.origin}/progress/${encodedState}`
    }

    const fromUrl = (url: string) => {
        const encodedState = url.split("progress/")[1]

        if (!encodedState) {
            return null
        }

        const compressedState: SavedProgressState = JSON.parse(
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            LZString.decompressFromEncodedURIComponent(encodedState)!
        )

        return deserialize(compressedState)
    }

    return { serialize, deserialize, toUrl, fromUrl }
}
