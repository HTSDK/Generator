export type Primitives = "string" | "boolean" | "int32" | "int64" | "float64"
export type Literals = string | number | boolean | Literals[]

export type Type = {
  kind: "array",
  items: Type
} | {
  kind: "union",
  items: Type[]
} | {
  kind: "enum",
  values: string[]
} | {
  kind: "primitive"
  type: Primitives
} | {
  kind: "record",
  keys: Type,
  items: Type
} | {
  kind: "object",
  items: Record<string, Type>
} | {
  kind: "literal",
  value: Literals
}

export type Resource = {
  resources?: Resource[]
}

export type OperationRequest = {
  method: "GET" | "POST"
  path: string
  arguments?: ({ name: string, type: Type } & ({ key: string } | { spread: true }))[]
  returns?: Type
}

export type Operation = {
  description?: string
  request: OperationRequest
  returns?: boolean
}

export type SDK = {
  url: {
    dynamic: false
    default: string
  } | {
    dynamic: true
    default?: string
  }
  /** Default headers for the entire SDK. Can be overwritten by individual resources, operations and requests. */
  headers?: Record<string, string>
  resources?: Record<string, Resource>
  operations?: Record<string, Operation>
}