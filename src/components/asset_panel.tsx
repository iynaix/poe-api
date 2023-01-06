import PaneHeader from "./pane_header"
import SearchPalette from "./search_palette"
import AssetList from "./asset_list"
import { useState } from "react"
import { useAssetStore } from "../utils/progress_stores"
import PoeIcon, { DIVINE_ICON, CHAOS_ICON } from "./poe_icon"
import Stat from "./stat"
import Button from "./button"
import { truncateFloat } from "../utils"

const AssetPanel = () => {
    const { add: addAsset, totalChaos, totalDivines } = useAssetStore()

    const [showDivineStat, setShowDivineStat] = useState(true)
    const [openAssetSearchModal, setAssetOpenSearchModal] = useState(false)

    return (
        <div className="p-4">
            <PaneHeader>I Have</PaneHeader>

            <dl className="mt-5 grid grid-cols-1 gap-5">
                <Stat
                    name={showDivineStat ? "Divine Orb" : "Chaos Orb"}
                    icon={
                        <PoeIcon
                            icon={showDivineStat ? DIVINE_ICON : CHAOS_ICON}
                            alt={showDivineStat ? "Divine Orb" : "Chaos Orb"}
                            size={48}
                        />
                    }
                    onClick={() => {
                        setShowDivineStat(!showDivineStat)
                    }}
                >
                    {truncateFloat(showDivineStat ? totalDivines() : totalChaos(), 3)}
                </Stat>
            </dl>

            <AssetList />

            <div className="mt-4 flex flex-col p-8">
                <Button
                    className="w-full justify-center"
                    onClick={() => {
                        setAssetOpenSearchModal(!openAssetSearchModal)
                    }}
                >
                    Add Item
                </Button>
            </div>

            <SearchPalette
                open={openAssetSearchModal}
                setOpen={setAssetOpenSearchModal}
                onSelect={(price) => {
                    // default count to 1
                    addAsset(price.id, { count: 1 })
                }}
            />
        </div>
    )
}
export default AssetPanel
