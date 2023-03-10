// load all mingo operators
import "mingo/init/system"

import "./currencies/schema"
import "./items/schema"
import "./combined/schema"
import "./trade/schema"

import { builder } from "./builder"

// initialize the root query
builder.queryType()

export const schema = builder.toSchema()
