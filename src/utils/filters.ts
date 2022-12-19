import { builder } from "../graphql/builder"

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
