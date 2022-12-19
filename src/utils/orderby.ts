import { builder } from "../graphql/builder"
import { InputFieldMap, InputShapeFromFields } from "@pothos/core"

export const OrderBy = builder.enumType("OrderBy", {
    values: ["asc", "desc"] as const,
})

export const createOrderBy = (name: string, orderBy: string[]) => {
    // create the orderby input to be passed into t.arg
    const orderByInput = builder.inputType(name, {
        fields: (t) => {
            const fields: InputFieldMap = {}
            for (const key of orderBy) {
                fields[key] = t.field({ type: OrderBy, required: false })
            }
            return fields
        },
    })

    const sortAgg = (
        orderByArg: InputShapeFromFields<InputFieldMap<"InputObject">> | null | undefined
    ) => {
        if (!orderByArg) return {}

        return Object.assign(
            {},
            ...Object.entries(orderByArg).map(([fieldName, order]) => {
                return order ? { [fieldName]: order === "asc" ? 1 : -1 } : undefined
            })
        )
    }

    return [orderByInput, sortAgg] as const
}
