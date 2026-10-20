import { Literals, Type } from "@htsdk/generator-ir"
import CodeBlockWriter from "code-block-writer"
import { options } from "."
import { casing } from "@htsdk/generator-core"

export function parseType(type: Type): string {
  const writer = new CodeBlockWriter(options)

  switch (type.kind) {
    case "literal": {
      function write(value: Literals) {
        if (typeof value === "string") {
          writer.quote(value)
        } else if (typeof value === "boolean" || typeof value === "number") {
          writer.write(value.toString())
        } else if (Array.isArray(value)) {
          writer.write("[")
          for (const val of value) {
            const i = value.indexOf(val)
            write(val)
            if (i < value.length - 1) {
              writer.write(", ")
            }
          }
          writer.write("]")
        }
      }

      write(type.value)
      break
    }
    case "primitive": {
      switch (type.type) {
        case "string": {
          writer.write("string")
          break
        }
        case "boolean": {
          writer.write("boolean")
          break
        }
        case "int32": {
          writer.write("number")
          break
        }
        case "int64": {
          writer.write("number")
          break
        }
        case "float64": {
          writer.write("number")
          break
        }
      }
      break
    }
    case "array": {
      writer.write(`Array<${parseType(type.items)}>`)
      break
    }
    case "union": {
      for (const value of type.items) {
        const i = type.items.indexOf(value)
        writer.write(parseType(value))
        if (i < type.items.length - 1) {
          writer.write(" | ")
        }
      }
      break
    }
    case "enum": {
      writer.write(parseType({
        kind: "union",
        items: type.values.map(value => ({
          kind: "literal",
          value
        }))
      }))
      break
    }
    case "object": {
      writer.write("{")
      const items = Object.keys(type.items)
      for (const [index, name] of items.entries()) {
        if (index !== 0) {
          writer.write(",")
        }
        writer.write(" ")
        writer.write(casing("camel", name))
        writer.write(`: ${parseType(type.items[name])}`)
      }
      writer.write(" }")
      break
    }
    case "record": {
      writer.write(`Record<${parseType(type.keys)}, ${parseType(type.items)}>`)
      break
    }
  }

  return writer.toString()
}