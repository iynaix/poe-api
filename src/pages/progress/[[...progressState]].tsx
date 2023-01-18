import { usePricesQuery } from "../../utils/progress_stores"
import Tabs from "../../components/tabs"
import AssetPanel from "../../components/asset_panel"
import TargetPanel from "../../components/target_panel"
import { useEffect, useState } from "react"
import ProgressPageHeader from "../../components/progress_page_header"

export default function ProgressLoader() {
    const [showChild, setShowChild] = useState(false)

    // client loads cached prices from localstorage and will be hydrated differently
    // than the server, so we need to skip SSR to avoid hydration mismatch
    useEffect(() => {
        setShowChild(true)
    }, [])

    const { data, isLoading, isFetching } = usePricesQuery()

    if (!showChild) {
        return null
    }

    if (isLoading || !data) {
        return <div>Loading...</div>
    }

    return <Progress isFetching={isLoading || isFetching} />
}

/*
const useUrlProgressState = () => {
    const router = useRouter()
    const stateFromUrl = router.query.progressState

    if (stateFromUrl) {
        if (typeof stateFromUrl === "string") {
            const jsonString = LZString.decompressFromEncodedURIComponent(stateFromUrl)
            if (jsonString) {
                return JSON.parse(jsonString) as SavedProgressState
            }
        } else if (stateFromUrl.length === 1) {
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            const jsonString = LZString.decompressFromEncodedURIComponent(stateFromUrl[0]!)
            if (jsonString) {
                return JSON.parse(jsonString) as SavedProgressState
            }
        }
    }
}
*/

type ProgressProps = {
    isFetching: boolean
}

const Progress = ({ isFetching }: ProgressProps) => {
    return (
        <>
            {/* mobile tabs */}
            <div className="md:hidden">
                <Tabs titles={["I Have", "I Want"]}>
                    <AssetPanel />
                    <TargetPanel />
                </Tabs>
            </div>
            {/* desktop panes */}
            <>
                <ProgressPageHeader isFetching={isFetching} />
                <div className="hidden grid-cols-2 gap-20 md:visible md:grid">
                    <AssetPanel />
                    <TargetPanel />
                </div>
            </>
        </>
    )
}
