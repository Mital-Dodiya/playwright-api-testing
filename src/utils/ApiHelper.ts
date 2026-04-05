import { APIRequestContext, APIResponse, expect } from '@playwright/test';

export class ApiHelper {
  private request: APIRequestContext;
  private baseUrl: string;

  constructor(request: APIRequestContext, baseUrl: string) {
    this.request = request;
    this.baseUrl = baseUrl;
  }

  async get(endpoint: string): Promise<APIResponse> {
    return await this.request.get(`${this.baseUrl}${endpoint}`);
  }

  async post(endpoint: string, body: object): Promise<APIResponse> {
    return await this.request.post(`${this.baseUrl}${endpoint}`, { data: body });
  }

  async put(endpoint: string, body: object): Promise<APIResponse> {
    return await this.request.put(`${this.baseUrl}${endpoint}`, { data: body });
  }

  async patch(endpoint: string, body: object): Promise<APIResponse> {
    return await this.request.patch(`${this.baseUrl}${endpoint}`, { data: body });
  }

  async delete(endpoint: string): Promise<APIResponse> {
    return await this.request.delete(`${this.baseUrl}${endpoint}`);
  }

  async verifyStatusCode(response: APIResponse, expectedCode: number): Promise<void> {
    expect(response.status()).toBe(expectedCode);
  }

  async verifyResponseBody(response: APIResponse, key: string, value: unknown): Promise<void> {
    const body = await response.json();
    expect(body[key]).toBe(value);
  }

  async verifyResponseContainsKey(response: APIResponse, key: string): Promise<void> {
    const body = await response.json();
    expect(body).toHaveProperty(key);
  }

  async getResponseBody(response: APIResponse): Promise<Record<string, unknown>> {
    return await response.json();
  }
}
