import classNames from "classnames"
import { Children, useState, type PropsWithChildren } from "react"

type TabsProps = PropsWithChildren<{
    titles: string[]
    initialIndex?: number
}>

export default function Tabs({ titles, initialIndex = 0, children }: TabsProps) {
    const [idx, setIdx] = useState(initialIndex)

    return (
        <div>
            <div className="sm:block">
                <div className="border-b border-gray-200">
                    <nav className="-mb-px flex" aria-label="Tabs">
                        {Children.map(children, (_, tabIdx) => {
                            const isCurrent = idx === tabIdx

                            return (
                                <div
                                    key={`tab-${tabIdx}`}
                                    className={classNames(
                                        isCurrent
                                            ? "border-sapphire text-sapphire"
                                            : "border-transparent text-text hover:border-surface1 hover:text-subtext1",
                                        "whitespace-nowrap border-b-2 py-4 px-1 text-center text-lg font-medium",
                                        "flex-1"
                                    )}
                                    aria-current={isCurrent ? "page" : undefined}
                                    onClick={() => setIdx(tabIdx)}
                                >
                                    {titles[tabIdx]}
                                </div>
                            )
                        })}
                    </nav>
                </div>
            </div>
            <div>{Children.toArray(children)[idx]}</div>
        </div>
    )
}
