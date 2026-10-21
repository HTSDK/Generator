import { Operation } from "@htsdk/generator-ir"
import CodeBlockWriter from "code-block-writer"
import { options } from "."
import { casing } from "@htsdk/generator-core"
import { parseType } from "./type"

export function generateOperation(name: string, operation: Operation, useNew?: boolean): string {
  const writer = new CodeBlockWriter(options)

  if (operation.returns === false) {
    writer.write("async ")
  }
  writer.write(`${casing("camel", name)}(`)
  if (operation.request.arguments) {
    for (const argument of operation.request.arguments) {
      const i = operation.request.arguments.indexOf(argument)

      writer.write(casing("camel", argument.name))
      writer.write(`: ${parseType(argument.type)}`)

      if (i < operation.request.arguments.length - 1) {
        writer.write(", ")
      }
    }
  }
  writer.write(")")
  writer.block(() => {
    if (useNew) {
      writer.writeLine("const api = new API()")
    }
    writer.write(`${operation.returns === false ? "await" : "return"} ${useNew ? "api" : "this"}.GET`)
    if (operation.request.returns) {
      writer.write(`<${parseType(operation.request.returns)}>`)
    }
    writer.write("(")
    writer.quote(operation.request.path)
    if (operation.request.arguments) {
      writer.write(", {")
      for (const argument of operation.request.arguments) {
        const i = operation.request.arguments.indexOf(argument)
        if (i !== 0) {
          writer.write(",")
        }
        writer.write(" ")
        if ("spread" in argument) {
          writer.write("...")
        }
        if ("key" in argument) {
          writer.write(casing("camel", argument.key))
          if (argument.type.kind === "primitive" && (argument.type.type === "int32" || argument.type.type === "int64" || argument.type.type === "float64" || argument.type.type === "boolean")) {
            writer.write(`: ${casing("camel", argument.name)}.toString()`)
          }
        } else {
          writer.write(casing("camel", argument.name))
        }
      }
      writer.write(" }")
    }
    writer.write(")")
  })

  return writer.toString()
}