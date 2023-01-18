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
                "inline-flex items-center rounded-md border border-transparent bg-blue px-4 py-2 text-center font-medium text-mantle shadow-sm hover:bg-sapphire focus:outline-none focus:ring-2 focus:ring-sapphire focus:ring-offset-2",
                className
            )}
            onClick={onClick}
        >
            {children}
        </button>
    )
}
