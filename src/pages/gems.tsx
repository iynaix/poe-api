import { trpc } from "../utils/trpc"

const GemsPage = () => {
    const { data, isLoading } = trpc.gems.profit.useQuery()

    if (isLoading) return <div>Loading...</div>

    return <pre>{JSON.stringify(data, null, 2)}</pre>
}

export default GemsPage
