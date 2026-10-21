import { SDK } from "@htsdk/generator-ir"
import CodeBlockWriter from "code-block-writer"
import { options } from "."
import { casing } from "@htsdk/generator-core"
import { generateOperation } from "./operation"

export function generateClient(sdk: SDK): string {
  const writer = new CodeBlockWriter(options)

  writer.write("import { API } from ").quote("./api").newLine()

  if (sdk.resources) {
    for (const name in sdk.resources) {
      writer.write(`import { ${casing("pascal", name)} } from `).quote(`./resources/${casing("camel", name)}`).newLine()
    }
  }

  writer.newLine()
  writer.write("export class Client").block(() => {
    writer.writeLine("constructor() {}").newLine()
    if (sdk.operations) {
      for (const [name, operation] of Object.entries(sdk.operations)) {
        writer.write(generateOperation(name, operation, true))
      }
    }
  })

  return writer.toString()
}