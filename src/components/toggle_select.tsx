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
                className={`relative inline-flex items-center rounded-l-md border px-2 py-2 text-sm font-medium bg-white text-gray-500 border-gray-300 hover:bg-gray-50 focus:z-10 focus:outline-none focus:ring-1 focus:border-indigo-500 focus:ring-indigo-500 ${
                    selection ? "bg-indigo-600" : ""
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
                className={`relative -ml-px inline-flex items-center rounded-r-md border px-2 py-2 text-sm font-medium bg-white text-gray-500 border-gray-300 hover:bg-gray-50 focus:z-10 focus:outline-none focus:ring-1 focus:border-indigo-500 focus:ring-indigo-500 ${
                    !selection ? "bg-indigo-600" : ""
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
