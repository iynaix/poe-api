import { EnumParam, EnumRef, InputFieldMap, InputShapeFromFields } from "@pothos/core"
import { builder, ItemEndpoint } from "../graphql/builder"
import { mapKeys } from "lodash"

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

const filterString = (name: string, val: Record<string, string | string[]>) => {
    const mongoParams = Object.entries(val).map(_stringOperator)

    return {
        $and: mongoParams.map((v) => ({
            [name]: v,
        })),
    }
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

export const EnumFilter = (enumName: string, enumType: EnumRef<EnumParam>) =>
    builder.inputType(`${enumName}EnumFilter`, {
        fields: (t) => ({
            _eq: t.field({ type: enumType, required: false }),
            _ne: t.field({ type: enumType, required: false }),
            _in: t.field({ type: [enumType], required: false }),
            _nin: t.field({ type: [enumType], required: false }),
        }),
    })

const filterNumber = (fieldName: string, fieldValue: Record<string, number>) => {
    return { [fieldName]: mapKeys(fieldValue, (_, k) => k.replace("_", "$")) }
}

export const ModifierFilter = builder.inputType("ModifierFilter", {
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

const filterModifier = (name: string, val: Record<string, string | string[]>) => {
    const origMongoParams = filterString(name, val)
    return {
        ...origMongoParams,
        // append .text to the end of the field name for filterString
        $and: origMongoParams["$and"].map((strOp) => mapKeys(strOp, (_, k) => `${k}.text`)),
    }
}

// creates both the where input type for arg and the $match aggregation for mingo
export const createWhere = (
    name: string,
    where: Record<string, typeof StringFilter | typeof NumberFilter | ReturnType<typeof EnumFilter>>
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

        return Object.assign(
            {},
            ...Object.entries(whereArg).map(([filterName, filterValue]) => {
                if (!filterValue) return

                if (where[filterName] === StringFilter) {
                    return filterString(
                        filterName,
                        filterValue as Record<string, string | string[]>
                    )
                }

                if (where[filterName] === NumberFilter) {
                    return filterNumber(filterName, filterValue as Record<string, number>)
                }

                if (where[filterName] === ModifierFilter) {
                    return filterModifier(
                        filterName,
                        filterValue as Record<string, string | string[]>
                    )
                }

                // enum filter special case
                if (where[filterName].name.endsWith("EnumFilter")) {
                    // handle enum filter as string filter
                    return filterString(
                        filterName,
                        filterValue as Record<string, string | string[]>
                    )
                }

                // throw Error(`Invalid filter for ${filterName} of type ${where[filterName]}]}`)
            })
        )
    }

    return [whereInput, whereAgg] as const
}
