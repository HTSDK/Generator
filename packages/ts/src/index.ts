import { SDK } from "@htsdk/generator-ir"
import CodeBlockWriter, { Options } from "code-block-writer"
import { defineOperation, defineRequest, defineResource, defineSDK, t } from "@htsdk/generator-dsl"
import { generateAPI } from "./api"
import { generateClient } from "./client"
import { generateResources } from "./resources"

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
  files.set("api.ts", generateAPI(sdk))
  files.set("client.ts", generateClient(sdk))
  files.set("index.ts", generateIndex(sdk))
  if (sdk.resources) {
    const resources = generateResources([], sdk.resources)
    for (const [key, value] of resources) {
      files.set(key, value)
    }
  }
  return files
}

const result = generate(
  defineSDK({
    url: {
      dynamic: false,
      default: "https://api.iinapi.com"
    },
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    },
    resources: {
      test: defineResource({
        resources: {
          another: defineResource({
            operations: {}
          })
        },
        operations: {
          test: defineOperation({
            request: defineRequest({
              method: "GET",
              path: "/"
            })
          })
        }
      })
    },
    operations: {
      lookup: defineOperation({
        returns: true,
        request: defineRequest({
          method: "GET",
          path: "/iin",
          arguments: [
            {
              name: "digits",
              type: t.primitive("int64"),
              key: "digits"
            }
          ],
          returns: t.object({
            valid: t.primitive("boolean"),
            result: t.object({
              Bin: t.primitive("int64"),
              IssuingInstitution: t.primitive("string"),
              CardType: t.primitive("string"),
              CardCategory: t.primitive("string"),
              IssuingCountry: t.primitive("string"),
              IssuingCountryCode: t.primitive("string")
            })
          })
        })
      })
    }
  })
)

console.log(result)
for (const [name, content] of result) {
  await Bun.write(`../${name}`, content)
}