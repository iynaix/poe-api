import React, { useState } from "react"
import PoeIcon, { ChaosPrice, DivinePrice, PoeIconText } from "./poe_icon"
import type { Price } from "../server/trpc/router/prices"
import { trpc } from "../utils/trpc"

type SearchResultsProps = {
    prices: Price[]
    onClick: (price: Price) => void
}

const SearchResults = ({ prices, onClick }: SearchResultsProps) => {
    return (
        <div>
            {prices.map((price) => {
                return (
                    <div
                        className="my-2 grid grid-cols-5 items-center"
                        key={price.id}
                        onClick={() => {
                            onClick(price)
                        }}
                    >
                        <div className="col-span-3 flex flex-row items-center">
                            {/*
                            <div className="mx-2">
                                {price.icon && (
                                    <PoeIcon icon={price.icon} alt={price.name} size={30} />
                                )}
                            </div>
                            <div>
                                <p className="text-lg">{price.name}</p>
                                <p className="text-xs opacity-40">{price.id}</p>
                            </div>
                            */}
                            <PoeIconText
                                iconProps={{
                                    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                                    icon: price.icon!,
                                    alt: price.name,
                                    size: 30,
                                }}
                                name={price.name}
                                // secondaryText={price.id}
                            />
                        </div>
                        <div className="ml-auto flex">
                            <DivinePrice amount={price.divineValue} size={18} />
                        </div>
                        <div className="ml-auto flex">
                            <ChaosPrice amount={price.chaosValue} size={18} />
                        </div>
                    </div>
                )
            })}
        </div>
    )
}

type SearchByIdProps = {
    label: string
    onClick: (price: Price) => void
}

const SearchById = ({ label, onClick }: SearchByIdProps) => {
    const [query, setQuery] = useState<string>("")

    const { data, isLoading } = trpc.prices.byName.useQuery({ query })

    return (
        <>
            <span>{label}</span>
            <input
                className="bg-gray-800 text-gray-50"
                name="Search"
                type="text"
                value={query}
                min={0}
                onChange={(ev) => {
                    setQuery(ev.target.value)
                }}
            />

            {isLoading && <div>Loading...</div>}

            {data && <SearchResults prices={data} onClick={onClick} />}
        </>
    )
}

export default SearchById
