import { API } from "./api"

export class Client {
  constructor() {}

  lookup(digits: number) {
    const api = new API()
    return api.GET<{ valid: boolean, result: { bin: number, issuingInstitution: string, cardType: string, cardCategory: string, issuingCountry: string, issuingCountryCode: string } }>("/iin", { digits: digits.toString() })
  }
}