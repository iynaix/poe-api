import PaneHeader from "./pane_header"
import SearchPalette from "./search_palette"
import AssetList from "./asset_list"
import { useState } from "react"
import { useAssetStore } from "../utils/progress_stores"
import PoeIcon, { DIVINE_ICON, CHAOS_ICON } from "./poe_icon"
import Stat from "./stat"
import { truncateFloat } from "../utils"

const AssetPanel = () => {
    const { add: addAsset, totalChaos, totalDivines } = useAssetStore()

    const [openAssetSearchModal, setAssetOpenSearchModal] = useState(false)

    return (
        <div className="p-4">
            <PaneHeader
                right={
                    <button
                        type="button"
                        className="inline-flex items-center rounded-md border px-4 py-2 text-sm font-medium shadow-sm border-transparent text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        onClick={() => {
                            setAssetOpenSearchModal(!openAssetSearchModal)
                        }}
                    >
                        Add
                    </button>
                }
            >
                I Have
            </PaneHeader>

            <dl className="mt-5 grid grid-cols-2 gap-5">
                <Stat
                    name="Divine Orb"
                    icon={<PoeIcon icon={DIVINE_ICON} alt="Divine Orb" size={48} />}
                >
                    {truncateFloat(totalDivines(), 3)}
                </Stat>
                <Stat
                    name="Chaos Orb"
                    icon={<PoeIcon icon={CHAOS_ICON} alt="Chaos Orb" size={48} />}
                >
                    {truncateFloat(totalChaos(), 0)}
                </Stat>
            </dl>

            <AssetList />

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
