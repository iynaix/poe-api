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
        _in: t.string({ required: false }),
        _nin: t.string({ required: false }),
    }),
})
