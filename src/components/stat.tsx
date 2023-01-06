import type { PropsWithChildren, ReactNode } from "react"
import classNames from "classnames"

type StatProps = PropsWithChildren<{
    name: string
    icon?: ReactNode
    onClick?: () => void
}>

const Stat = ({ name, icon, onClick, children }: StatProps) => {
    return (
        <div
            className={classNames(
                "relative overflow-hidden rounded-lg px-4 pt-5 pb-12 shadow bg-white",
                onClick ? "cursor-pointer" : ""
            )}
            onClick={onClick}
        >
            <dt>
                {icon && <div className="absolute px-3">{icon}</div>}
                <p className="ml-16 truncate text-sm font-medium text-gray-500">{name}</p>
            </dt>
            <dd className="ml-16 flex items-baseline">
                <p className="text-2xl font-semibold text-gray-900">{children}</p>
            </dd>
        </div>
    )
}

export default Stat
