import SchemaBuilder from "@pothos/core"
import { fetchCurrencies } from "./currencies/fetcher"
import { Currency } from "./currencies/types"

const builder = new SchemaBuilder<{
    Objects: {
        Currency: Currency
    }
}>({})

builder.objectType("Currency", {
    fields: (t) => ({
        id: t.exposeID("id"),
        // icon: t.exposeString("icon"),
        name: t.exposeString("name"),
        icon: t.exposeString("icon", { nullable: true }),
        chaosValue: t.exposeFloat("chaosValue"),
        divineValue: t.exposeFloat("divineValue"),
    }),
})

builder.queryType({
    fields: (t) => ({
        currencies: t.field({
            type: ["Currency"],
            resolve: async () => {
                return await fetchCurrencies()
            },
        }),
    }),
})

export const schema = builder.toSchema()
