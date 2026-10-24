import {
  Literals,
  Operation,
  OperationRequest,
  Primitives,
  Resource,
  SDK,
  Type
} from "./ir"

export const t = {
  array: (items: Type): Type => ({
    kind: "array",
    items
  }),
  union: (...items: Type[]): Type => ({
    kind: "union",
    items
  }),
  enum: (...values: string[]): Type => ({
    kind: "enum",
    values
  }),
  primitive: (type: Primitives): Type => ({
    kind: "primitive",
    type
  }),
  record: (keys: Type, items: Type): Type => ({
    kind: "record",
    keys,
    items
  }),
  object: (items: Record<string, Type>): Type => ({
    kind: "object",
    items
  }),
  literal: (value: Literals): Type => ({
    kind: "literal",
    value
  })
}

export const defineSDK = <const V extends string | number>(sdk: SDK<V>) => sdk
export const defineResource = (resource: Resource) => resource
export const defineOperation = <const V extends string | number>(operation: Operation<V>) => operation
export const defineRequest = <const P extends string>(request: OperationRequest<P>) => request