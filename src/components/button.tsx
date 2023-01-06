import type { PropsWithChildren } from "react"
import classNames from "classnames"

type ButtonProps = PropsWithChildren<{
    className?: string
    onClick?: () => void
}>

export default function Button({ onClick, className, children }: ButtonProps) {
    return (
        <button
            type="button"
            className={classNames(
                "inline-flex items-center rounded-md border px-4 py-2 text-center text-base font-medium shadow-sm border-transparent text-gray-100 bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500",
                className
            )}
            onClick={onClick}
        >
            {children}
        </button>
    )
}
