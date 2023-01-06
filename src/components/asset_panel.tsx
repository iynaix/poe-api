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
                {showDivineStat ? (
                    <Stat
                        name="Divine Orb"
                        icon={<PoeIcon icon={DIVINE_ICON} alt="Divine Orb" size={48} />}
                        onClick={() => {
                            setShowDivineStat(!showDivineStat)
                        }}
                    >
                        {truncateFloat(totalDivines(), 3)}
                    </Stat>
                ) : (
                    <Stat
                        name="Chaos Orb"
                        icon={<PoeIcon icon={CHAOS_ICON} alt="Chaos Orb" size={48} />}
                        onClick={() => {
                            setShowDivineStat(!showDivineStat)
                        }}
                    >
                        {truncateFloat(totalChaos(), 0)}
                    </Stat>
                )}
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
