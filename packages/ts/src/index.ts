import CodeBlockWriter, { Options } from "code-block-writer"
import { generateAPI } from "./api"
import { generateClient } from "./client"
import { generateResources } from "./resources"
import { SDK } from "@htsdk/generator-core/ir"

export const options: Partial<Options> = {
  newLine: "\r\n",
  indentNumberOfSpaces: 2
}

function generateIndex(_: SDK): string {
  const writer = new CodeBlockWriter(options)

  writer.write("export { Client } from ").quote("./client")

  return writer.toString()
}

export function generate(sdk: SDK): Map<string, string> {
  const files = new Map<string, string>()

  const version = sdk.versions[sdk.default]

  files.set("api.ts", generateAPI(version))
  files.set("client.ts", generateClient(version))
  files.set("index.ts", generateIndex(sdk))

  if (version.resources) {
    const resources = generateResources([], version.resources)
    for (const [key, value] of resources) {
      files.set(key, value)
    }
  }
  return files
}