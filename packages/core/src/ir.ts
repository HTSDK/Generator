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
  resources?: Record<string, Resource>
  operations?: Record<string, OperationCollection | OperationVersion>
}

type PathParams<P extends string> = P extends `${string}[${infer Param}]${infer Rest}` ? Param | PathParams<Rest> : never

export type OperationRequest<P extends string = string> = {
  method: "GET" | "POST" | "DELETE"
  path: P
  arguments?: ({ name: string, type: Type } & ({ key: string } | { spread: true }))[]
  type?: Type
  description?: string
  returns?: boolean
} & (PathParams<P> extends never ? object : { params: Record<PathParams<P>, { type: Type }> })

export type OperationVersion = {
  request: OperationRequest
}

export type OperationCollection<V extends string | number = string | number> = {
  versions: Record<V, OperationVersion>
  default: NoInfer<V>
}

export type Operation<V extends string | number = string | number> = OperationCollection<V> | OperationVersion

export type SDKVersion = {
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

export type SDK<V extends string | number = string | number> = {
  versions: Record<V, SDKVersion>
  default: NoInfer<V>
}