import type { EnumParam, EnumRef, InputFieldMap, InputShapeFromFields } from "@pothos/core"
import { builder } from "../graphql/builder"
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

export const IntFilter = builder.inputType("IntFilter", {
    fields: (t) => ({
        _eq: t.int({ required: false }),
        _ne: t.int({ required: false }),
        _lt: t.int({ required: false }),
        _lte: t.int({ required: false }),
        _gt: t.int({ required: false }),
        _gte: t.int({ required: false }),
    }),
})

export const FloatFilter = builder.inputType("FloatFilter", {
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

type WhereInitializer = Record<
    string,
    typeof StringFilter | typeof IntFilter | typeof FloatFilter | ReturnType<typeof EnumFilter>
>

type WhereArgumentBasic = InputShapeFromFields<InputFieldMap<"InputObject">> | null | undefined
type WhereArgument = WhereArgumentBasic & {
    _and?: WhereArgument[]
    _or?: WhereArgument[]
    _not?: WhereArgument[]
}

const _createWhereAggreation = (whereDefintion: WhereInitializer) => {
    // create the $match aggregation for mingo
    const whereAggregation = (whereArgument: WhereArgument | undefined | null) => {
        if (!whereArgument) return {}

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { _and, _or, _not, ...basicWhereArg } = whereArgument

        const basicFilter = Object.assign(
            {},
            ...Object.entries(basicWhereArg).map(([filterName, filterValue]) => {
                if (!filterValue) return

                const filterType = whereDefintion[filterName]?.name

                if (!filterType) {
                    throw Error(`Invalid filter for ${filterName}`)
                }

                if (filterType === "StringFilter") {
                    return filterString(
                        filterName,
                        filterValue as Record<string, string | string[]>
                    )
                }

                if (filterType === "IntFilter" || filterType === "FloatFilter") {
                    return filterNumber(filterName, filterValue as Record<string, number>)
                }

                if (filterType === "ModifierFilter") {
                    return filterModifier(
                        filterName,
                        filterValue as Record<string, string | string[]>
                    )
                }

                // enum filter is a function that returns an input type
                if (filterType.endsWith("EnumFilter")) {
                    // handle enum filter as string filter
                    return filterString(
                        filterName,
                        filterValue as Record<string, string | string[]>
                    )
                }

                throw Error(
                    `Invalid filter for ${filterName} of type ${whereDefintion[filterName]}]}`
                )
            }),
            // handle the recursive portions
            _createWhereAggreationRecursive(whereArgument, whereAggregation)
        )

        return basicFilter
    }

    return whereAggregation
}

const _createWhereAggreationRecursive = (
    whereArg: WhereArgument,
    // we don't know the type of the where aggregation so we have to use any
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    whereAggregation: (whereArg: WhereArgument) => any
) => {
    const { _and, _or, _not } = whereArg

    const $and = _and ? { $and: _and?.map((andArg) => whereAggregation(andArg)) } : undefined
    const $or = _or ? { $or: _or?.map((orArg) => whereAggregation(orArg)) } : undefined
    const $not = _not ? { $not: _not?.map((notArg) => whereAggregation(notArg)) } : undefined

    return {
        ...$and,
        ...$or,
        ...$not,
    }
}

// creates both the where input type for arg and the $match aggregation for mingo
export const createWhere = (name: string, where: WhereInitializer) => {
    // create the where input to be passed into t.arg
    const recursiveWhereInput = builder.inputRef(name).implement({
        fields: (t) => {
            // create the non recursive fields
            const baseFields: InputFieldMap = {}
            for (const [key, value] of Object.entries(where)) {
                baseFields[key] = t.field({ type: value, required: false })
            }

            return {
                ...baseFields,
                // add recursive fields
                _and: t.field({ type: [recursiveWhereInput], required: false }),
                _not: t.field({ type: [recursiveWhereInput], required: false }),
                _or: t.field({ type: [recursiveWhereInput], required: false }),
            }
        },
    })

    const whereAgg = _createWhereAggreation(where)

    return [recursiveWhereInput, whereAgg] as const
}
