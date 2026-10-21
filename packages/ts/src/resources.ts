import { SDK } from "@htsdk/generator-ir"
import CodeBlockWriter from "code-block-writer"
import { options } from "."
import { casing } from "@htsdk/generator-core"
import { generateOperation } from "./operation"

const path = (parents: string[], name: string) => `resources/${parents.map(parent => `${casing("camel", parent)}/`)}${casing("camel", name)}/index.ts`

export function generateResources(parents: string[], resources: NonNullable<SDK["resources"]>): Map<string, string> {
  const files = new Map<string, string>()
  for (const [name, resource] of Object.entries(resources)) {
    const writer = new CodeBlockWriter(options)

    if (resource.resources) {
      const resources = generateResources([...parents, name], resource.resources)
      for (const [path, content] of resources) {
        files.set(path, content)
      }
    }

    writer.write("import { API } from ").quote(`${"../".repeat(parents.length + 2)}api`).newLine()
    writer.newLine()
    writer.write(`export class ${parents.map(parent => casing("pascal", parent))}${casing("pascal", name)} extends API`).block(() => {
      if (resource.operations) {
        for (const [name, operation] of Object.entries(resource.operations)) {
          writer.write(generateOperation(name, operation))
        }
      }
    })

    files.set(path(parents, name), writer.toString())
  }
  return files
}