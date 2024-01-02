import { ApiConfig, ApiResponse } from "../ApiTypes";

export class AuthApi {
  private config: ApiConfig;

  constructor(config: ApiConfig) {
    this.config = config;
  }

  async registerUser(
    username: string,
    email: string,
    password: string
  ): Promise<ApiResponse> {
    const response = await fetch(`${this.config.apiUrl}/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: username,
        email: email,
        password: password,
      }),
    });
    const result = await response.json();
    const data = {
      ...result,
      status: response.status,
    } as ApiResponse;
    return data;
  }

  async login(username: string, password: string): Promise<ApiResponse> {
    const response = await fetch(`${this.config.apiUrl}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: username,
        password: password,
      }),
    });
    const result = await response.json();
    const data = {
      ...result,
      status: response.status,
    } as ApiResponse;
    return data;
  }
}
