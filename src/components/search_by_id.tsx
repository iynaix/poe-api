import React, { useState } from "react"
import Image from "next/image"
import type { Price } from "../server/trpc/router/prices"
import { trpc } from "../utils/trpc"

const POE_ICON_SIZE = 47

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
                        key={price.id}
                        onClick={() => {
                            onClick(price)
                        }}
                    >
                        {price.icon && (
                            <Image
                                src={price.icon}
                                alt={price.name}
                                className="inline-block h-6 w-6"
                                width={POE_ICON_SIZE}
                                height={POE_ICON_SIZE}
                            />
                        )}
                        <span className="px-2">{price.name}</span>
                        <span className="px-2">{price.id}</span>
                        <span className="px-2">{price.divineValue}</span>
                        <span>{price.chaosValue}</span>
                    </div>
                )
            })}
        </div>
    )
}

type SearchByIdProps = {
    onClick: (price: Price) => void
}

const SearchById = ({ onClick }: SearchByIdProps) => {
    const [query, setQuery] = useState<string>("")

    const { data, isLoading } = trpc.prices.byName.useQuery({ query })

    return (
        <>
            <span>Add Asset</span>
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
