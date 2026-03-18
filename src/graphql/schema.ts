// load all mingo operators
import "mingo/init/system"

import "./exchange/schema"
import "./stash/schema"
import "./combined/schema"
import "./search/schema"
import "./trade/schema"

import { builder } from "./builder"

// initialize the root query
builder.queryType()

export const schema = builder.toSchema()
