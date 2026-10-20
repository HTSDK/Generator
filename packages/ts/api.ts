const BASE_URL = "https://api.iinapi.com" as const

export class API {
  constructor() {}

  async GET<O>(path: string, params?: Record<string, string>): Promise<O> {
    const url = new URL(`${BASE_URL}${path}`)
    if (params) {
      for (const [key, value] of Object.entries(params)) {
        url.searchParams.append(key, value)
      }
    }

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json"
      }
    })

    if (response.ok) {
      return await response.json() as O
    } else {
      throw new Error(`Request failed with status ${response.status}`)
    }
  }
}