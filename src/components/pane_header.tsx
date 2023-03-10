import { type PropsWithChildren } from "react"
import classNames from "classnames"

type PaneHeaderProps = PropsWithChildren<{
    className?: string
    right?: React.ReactNode
}>

export default function PaneHeader({ className, children, right }: PaneHeaderProps) {
    return (
        <div
            className={classNames(
                "border-b-2 border-surface2 bg-base p-5 sm:flex sm:items-center sm:justify-between",
                className
            )}
        >
            <h3 className="text-3xl font-medium leading-6 text-subtext1">{children}</h3>
            {right && <div className="mt-3 sm:mt-0 sm:ml-4">{right}</div>}
        </div>
    )
}
