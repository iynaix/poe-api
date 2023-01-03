import { trpc } from "../utils/trpc"
import type { Asset } from "../components/asset_row"
import TargetList from "../components/target_list"
import AssetList, { useAssets } from "../components/asset_list"
import { CHAOS_ICON } from "../components/poe_icon"
import type { Price } from "../server/trpc/router/prices"
import { createContext } from "react"

type ProgressProps = {
    assets: Record<string, Asset>
}

const Progress = ({ assets: initialAssets }: ProgressProps) => {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const divineValue = initialAssets["Divine Orb"]!.price.chaosValue

    const assetProps = useAssets(initialAssets, divineValue)

    return (
        <div className="grid grid-cols-2">
            <div>
                <h1 className="text-6xl font-bold">I Have</h1>

                <AssetList {...assetProps} />
            </div>

            <div>
                <h1 className="text-6xl font-bold">I Want</h1>

                <TargetList totalChaos={assetProps.totalChaos} divineValue={divineValue} />
            </div>
        </div>
    )
}

type PricesContext = {
    prices: Record<string, Price>
    divineValue: number
}

const PricesContext = createContext<PricesContext | null>(null)

export default function ProgressWrapper() {
    const { data: priceData, isLoading } = trpc.prices.list.useQuery({
        ids: ["Divine Orb"],
    })

    if (isLoading || !priceData) {
        return <div>Loading...</div>
    }

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const divinePrice = priceData["Divine Orb"]!
    const divineInChaos = divinePrice.chaosValue

    return (
        <PricesContext.Provider value={{ prices: priceData, divineValue: divineInChaos }}>
            <Progress
                assets={{
                    "Divine Orb": {
                        price: divinePrice,
                        count: 0,
                    },
                    //  create a chaos orb data as it isn't provided by poe ninja
                    "Chaos Orb": {
                        price: {
                            id: "Chaos Orb",
                            name: "Chaos Orb",
                            icon: CHAOS_ICON,
                            chaosValue: 1,
                            divineValue: 1 / divineInChaos,
                        },
                        count: 0,
                    },
                }}
            />
        </PricesContext.Provider>
    )
}
