import { ShareIcon } from "@heroicons/react/20/solid"
import { useExport } from "../utils/progress_export"
import Button from "./button"
import { useState } from "react"

const ShareButton = () => {
    const [isClicked, setIsClicked] = useState(false)
    const { toUrl } = useExport()

    return (
        <Button
            className="bg-peach text-sm text-mantle hover:bg-rosewater focus:ring-peach"
            onClick={() => {
                setIsClicked(!isClicked)

                navigator.clipboard.writeText(toUrl()).then(
                    () => {
                        alert("Copied to clipboard!")
                    },
                    () => {
                        alert("Failed to copy to clipboard!")
                    }
                )
            }}
        >
            <ShareIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
            <span>Share</span>
        </Button>
    )
}

export default ShareButton
