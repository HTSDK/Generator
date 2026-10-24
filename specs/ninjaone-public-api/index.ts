import { defineOperation, defineRequest, defineResource, defineSDK, t } from "@htsdk/generator-core/dsl";

const BetaCustomer = t.object({
  id: t.primitive("int64"),
  name: t.primitive("string"),
  description: t.primitive("string")
})

export default defineSDK({
  versions: {
    beta: {
      url: {
        dynamic: false,
        default: "https://eu-api.ninjarmm.com"
      },
      resources: {
        customers: defineResource({
          operations: {
            list: defineOperation({
              request: defineRequest({
                method: "GET",
                path: "/v1/customers",
                description: "Retrieve a list of all available customers.",
                type: t.array(BetaCustomer)
              })
            }),
            get: defineOperation({
              request: defineRequest({
                method: "GET",
                path: "/v1/customers/[id]",
                description: "Retrieve a specific customer.",
                params: {
                  id: {
                    type: t.primitive("int64")
                  }
                },
                type: BetaCustomer
              })
            })
          }
        })
      }
    },
    2: {
      url: {
        dynamic: false,
        default: "https://eu.ninjarmm.com"
      }
    }
  },
  default: 2
})