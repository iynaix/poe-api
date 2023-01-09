import { type ReactNode } from "react"

type ToggleSelectProps = {
    left: ReactNode
    leftAltText: string
    right: ReactNode
    rightAltText: string
    selection: boolean
    setSelection: (selection: boolean) => void
}

export default function ToggleSelect({
    left,
    leftAltText,
    right,
    rightAltText,
    selection,
    setSelection,
}: ToggleSelectProps) {
    return (
        <span className="isolate inline-flex rounded-md shadow-sm">
            <button
                type="button"
                className={`hover:sapphire relative inline-flex items-center rounded-l-md border border-surface1 bg-base px-2 py-2 text-sm font-medium text-text focus:z-10 focus:border-sapphire focus:outline-none focus:ring-1 focus:ring-sapphire ${
                    selection ? "bg-sapphire" : ""
                }`}
                onClick={() => {
                    setSelection(!selection)
                }}
            >
                <span className="sr-only">{leftAltText}</span>
                {left}
            </button>
            <button
                type="button"
                className={`hover:sapphire relative -ml-px inline-flex items-center rounded-r-md border border-surface1 bg-base px-2 py-2 text-sm font-medium text-text focus:z-10 focus:border-sapphire focus:outline-none focus:ring-1 focus:ring-sapphire ${
                    !selection ? "bg-sapphire" : ""
                }`}
                onClick={() => {
                    setSelection(!selection)
                }}
            >
                <span className="sr-only">{rightAltText}</span>
                {right}
            </button>
        </span>
    )
}
