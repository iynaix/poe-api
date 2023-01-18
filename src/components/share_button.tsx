import { ShareIcon } from "@heroicons/react/20/solid"
import { useShareUrl } from "../utils/progress_stores"
import Button from "./button"
import { useState } from "react"

// type ShareButtonProps = {}

const ShareButton = ({}) => {
    const [isClicked, setIsClicked] = useState(false)
    const { getShareUrl } = useShareUrl()

    return (
        <Button
            className="bg-peach text-sm text-mantle hover:bg-rosewater focus:ring-peach"
            onClick={() => {
                const shareUrl = getShareUrl()

                setIsClicked(!isClicked)

                navigator.clipboard.writeText(shareUrl).then(
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
