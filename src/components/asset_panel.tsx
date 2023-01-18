import PaneHeader from "./pane_header"
import SearchPalette from "./search_palette"
import AssetList from "./asset_list"
import { useState } from "react"
import { useAssetsActions, usePricesActions } from "../utils/progress_stores"
import PoeIcon, { DIVINE_ICON, CHAOS_ICON } from "./poe_icon"
import Stat from "./stat"
import Button from "./button"
import { truncateFloat } from "../utils"

const AssetPanel = () => {
    const { inDivines } = usePricesActions()
    const assetActions = useAssetsActions()
    const totalAssets = assetActions.total()

    const [showDivineStat, setShowDivineStat] = useState(true)
    const [openAssetSearchModal, setAssetOpenSearchModal] = useState(false)

    return (
        <div className="p-4">
            <PaneHeader className="hidden md:visible">I Have</PaneHeader>

            <dl className="mt-5 grid grid-cols-1 gap-5">
                <Stat
                    name="Net Worth"
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
                    {truncateFloat(showDivineStat ? inDivines(totalAssets) : totalAssets, 3)}
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
                    assetActions.add(price.id, { count: 1 })
                }}
            />
        </div>
    )
}
export default AssetPanel
