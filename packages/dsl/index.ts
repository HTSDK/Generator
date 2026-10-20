import { Literals, Operation, OperationRequest, Primitives, Resource, SDK, Type } from "@htsdk/generator-ir"

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

export const defineSDK = (sdk: SDK) => sdk
export const defineResource = (resource: Resource) => resource
export const defineOperation = (operation: Operation) => operation
export const defineRequest = (request: OperationRequest) => request