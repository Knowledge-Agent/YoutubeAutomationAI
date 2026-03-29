import { getAllConfigs } from '@/shared/models/config';

const DEFAULT_BASE_URL = 'https://api.apimart.ai/v1';

export class ApimartClient {
  constructor(
    private readonly apiKey: string,
    private readonly baseUrl: string = DEFAULT_BASE_URL
  ) {}

  static async fromConfigs() {
    const configs = await getAllConfigs();
    const apiKey = configs.apimart_api_key || '';
    const baseUrl = configs.apimart_base_url || DEFAULT_BASE_URL;

    if (!apiKey) {
      throw new Error('apimart_api_key is not set');
    }

    return new ApimartClient(apiKey, baseUrl);
  }

  async get<T>(path: string): Promise<T> {
    return this.request<T>(path, { method: 'GET' });
  }

  async post<T>(path: string, body: unknown): Promise<T> {
    return this.request<T>(path, {
      method: 'POST',
      body: JSON.stringify(body),
    });
  }

  private async request<T>(
    path: string,
    init: RequestInit & { body?: string }
  ): Promise<T> {
    const response = await fetch(`${this.baseUrl}${path}`, {
      ...init,
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
        ...(init.headers || {}),
      },
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(
        `apimart request failed: ${response.status} ${response.statusText}${text ? ` - ${text}` : ''}`
      );
    }

    return (await response.json()) as T;
  }
}

export function getApimartBaseUrl() {
  return DEFAULT_BASE_URL;
}
