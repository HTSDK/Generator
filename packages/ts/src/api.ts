import CodeBlockWriter from "code-block-writer"
import { SDK } from "@htsdk/generator-core/ir"
import { options } from "."

export function generateAPI(sdk: SDK): string {
  const writer = new CodeBlockWriter(options)

  if (!sdk.url.dynamic) {
    writer.writeLine(`const BASE_URL = "${sdk.url.default}" as const`)
    writer.newLine()
  }

  writer.write("export class API").block(() => {
    writer.writeLine("constructor() {}")
    writer.newLine()
    writer.write("async GET<O>(path: string, params?: Record<string, string>): Promise<O>").block(() => {
      writer.writeLine(`const url = new URL(\`\${BASE_URL}\${path}\`)`)
      writer.write("if (params)").block(() => {
        writer.write("for (const [key, value] of Object.entries(params))").block(() => {
          writer.write("url.searchParams.append(key, value)")
        })
      })
      writer.newLine()
      writer.newLine()
      writer.writeLine("const response = await fetch(url, {")
      writer.indent(() => {
        writer.write("method: ").quote("GET").write(",")
        writer.newLine()
        if (sdk.headers) {
          writer.write("headers: ").block(() => {
            const headers = Object.keys(sdk.headers!)
            for (const [index, header] of headers.entries()) {
              writer.quote(header).write(": ").quote(sdk.headers![header])
              if (index < headers.length - 1) {
                writer.write(",")
                writer.newLine()
              }
            }
          })
        }
      })
      writer.writeLine("})")
      writer.newLine()
      writer.writeLine("if (response.ok) {")
      writer.indent(() => {
        writer.write("return await response.json() as O")
      })
      writer.write("} else {")
      writer.indent(() => {
        writer.write("throw new Error(\`Request failed with status \${response.status}\`)")
      })
      writer.write("}")
    })
  })

  return writer.toString()
}