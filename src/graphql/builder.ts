import SchemaBuilder from "@pothos/core"
import { Currency } from "./currencies/types"

export const builder = new SchemaBuilder<{
    Objects: {
        Currency: Currency
    }
}>({})
