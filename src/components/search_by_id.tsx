import React, { useState } from "react"
import PoeIcon from "./poe_icon"
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
                        {price.icon && (
                            <PoeIcon
                                icon={price.icon}
                                alt={price.name}
                                className="h-[30px] w-[30px]"
                            />
                        )}
                        <span className="">{price.name}</span>
                        <span className="">{price.id}</span>
                        <span className="">{price.divineValue}</span>
                        <span>{price.chaosValue}</span>
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
