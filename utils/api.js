export class Api {
  async request(endpoint, { method, headers, body, ...params }) {
    const response = await fetch(`/api/${endpoint}`, {
      method,
      headers: {
        "Content-Type": "application/json",
        ...headers,
      },
      redirect: "follow",
      body: body ? JSON.stringify(body) : undefined,
      ...params,
    });
    if (response.ok) {
      const json = await response.json();
      return json;
    } else {
      throw await response.text();
    }
  }

  async get(url, params) {
    return await this.request(url, { ...params, method: "GET" });
  }

  async post(url, params) {
    return await this.request(url, { ...params, method: "POST" });
  }

  async put(url, params) {
    return await this.request(url, { ...params, method: "PUT" });
  }
}

export const api = new Api();
