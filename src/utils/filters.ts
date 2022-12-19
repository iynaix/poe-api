import { InputFieldMap, InputShapeFromFields } from "@pothos/core"
import { builder } from "../graphql/builder"

type StringFilterType = {
    _eq?: string
    _ieq?: string
    _ne?: string
    _ine?: string
    _contains?: string
    _icontains?: string
    _startswith?: string
    _istartswith?: string
    _endswith?: string
    _iendswith?: string
    _regex?: string
    _iregex?: string
    _in?: string[]
    _nin?: string[]
}

export const StringFilter = builder.inputType("StringFilter", {
    fields: (t) => ({
        _eq: t.string({ required: false }),
        _ieq: t.string({ required: false }),
        _ne: t.string({ required: false }),
        _ine: t.string({ required: false }),
        _contains: t.string({ required: false }),
        _icontains: t.string({ required: false }),
        _startswith: t.string({ required: false }),
        _istartswith: t.string({ required: false }),
        _endswith: t.string({ required: false }),
        _iendswith: t.string({ required: false }),
        _regex: t.string({ required: false }),
        _iregex: t.string({ required: false }),
        _in: t.stringList({ required: false }),
        _nin: t.stringList({ required: false }),
    }),
})

type NumberFilterType = {
    _eq?: number
    _ne?: number
    _lt?: number
    _lte?: number
    _gt?: number
    _gte?: number
}

export const NumberFilter = builder.inputType("NumberFilter", {
    fields: (t) => ({
        _eq: t.float({ required: false }),
        _ne: t.float({ required: false }),
        _lt: t.float({ required: false }),
        _lte: t.float({ required: false }),
        _gt: t.float({ required: false }),
        _gte: t.float({ required: false }),
    }),
})

// utility function for handling search operations
const _stringOperator = ([op, val]: [string, string | string[]]) => {
    switch (op) {
        case "_eq":
            return { $eq: val }
        case "_ne":
            return { $ne: val }
        case "_ieq":
            return { $regex: val, $options: "i" }
        case "_regex":
            return { $regex: val }
        case "_iregex":
            return { $regex: val, $options: "i" }
        case "_contains":
            return { $regex: val }
        case "_icontains":
            return { $regex: val, $options: "i" }
        case "_startswith":
            return { $regex: `^${val}` }
        case "_istartswith":
            return { $regex: `^${val}`, $options: "i" }
        case "_endswith":
            return { $regex: `${val}$` }
        case "_iendswith":
            return { $regex: `${val}$`, $options: "i" }
        case "_in":
            return { $in: val }
        case "_nin":
            return { $nin: val }
        default:
            throw Error(`Invalid string operation: ${op}`)
    }
}

export const filterString = (name: string, val: StringFilterType) => {
    const mongoParams = Object.entries(val).map(_stringOperator)

    return {
        $and: mongoParams.map((v) => ({
            [name]: v,
        })),
    }
}

export const createWhere = (
    name: string,
    where: Record<string, typeof StringFilter | typeof NumberFilter>
) => {
    // create the where input to be passed into t.arg
    const whereInput = builder.inputType(name, {
        fields: (t) => {
            const fields: InputFieldMap = {}
            for (const [key, value] of Object.entries(where)) {
                fields[key] = t.field({ type: value, required: false })
            }
            return fields
        },
    })

    // create the $match aggregation for mingo
    const whereAgg = (
        whereArg: InputShapeFromFields<InputFieldMap<"InputObject">> | null | undefined
    ) => {
        if (!whereArg) return {}

        const $match = {
            ...Object.entries(whereArg).map(([filterName, filterValue]) => {
                if (!filterValue) return

                if (where[filterName] === StringFilter) {
                    return filterString(filterName, filterValue as StringFilterType)
                }
            }),
        }

        return $match
    }

    return [whereInput, whereAgg] as const
}
