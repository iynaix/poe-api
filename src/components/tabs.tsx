import classNames from "classnames"

const tabs = [
    { name: "I Have", href: "#", current: false },
    { name: "I Want", href: "#", current: false },
]

export default function Example() {
    return (
        <div className="sm:block">
            <div className="border-b border-gray-200">
                <nav className="-mb-px flex" aria-label="Tabs">
                    {tabs.map((tab) => (
                        <a
                            key={tab.name}
                            href={tab.href}
                            className={classNames(
                                tab.current
                                    ? "text-indigo-600 border-indigo-500"
                                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300",
                                "rounded-md px-3 py-2 text-sm font-medium",
                                "border-b-2 py-4 px-1 text-center text-lg font-medium font-bold",
                                "flex-1"
                            )}
                            aria-current={tab.current ? "page" : undefined}
                        >
                            {tab.name}
                        </a>
                    ))}
                </nav>
            </div>
        </div>
    )
}
