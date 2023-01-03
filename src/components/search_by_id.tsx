import { useCallback, useState } from "react"
import _debounce from "lodash/debounce"
import { trpc } from "../utils/trpc"

const SearchById = () => {
    const [query, setQuery] = useState("")
    const { data } = trpc.prices.byName.useQuery({ query })

    const debounce = useCallback(
        (value: string) =>
            _debounce(() => {
                if (value.length >= 3) {
                    setQuery(value)
                }
            }, 500),
        []
    )

    return (
        <>
            <input
                className="bg-gray-800 text-gray-50"
                name="Search"
                value={query}
                min={0}
                onChange={(ev) => setQuery(ev.target.value)}
            />
            <pre>{JSON.stringify(data, null, 2)}</pre>
        </>
    )
}

export default SearchById
